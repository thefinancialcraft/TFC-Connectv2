Yeh rahi woh 8 queries jo page open hote hi ek ke baad ek (await) chalti hain aur loader ko 5+ second tak roke rakhti hain:

1. fetchAuth() — Duplicate User Verification
File: 

pages/portal/campaign/[id]/[customerId].tsx:Line 1730
 & 

lib/authService.ts:Line 75
Time Taken: ~400 ms
Code:
typescript
const { data: profileData } = await supabase
  .from("user_profiles")
  .select("*")
  .eq("user_id", authUser.id)
  .maybeSingle();
Kyun rukta hai: Page khulte hi user state null hoti hai. Jab tak yeh query Supabase se logged-in user ka profile dobara laa kar setUser() nahi karti, baaki ka koi bhi code shuru hi nahi hota.


2. Campaign Data & Permission Guard
File: 

pages/portal/campaign/[id]/[customerId].tsx:Line 1328
Time Taken: ~430 ms
Code:
typescript
const { data: fetchedCamp, error: campErr } = await supabase
  .from('campaigns')
  .select('*, organizations(id, company_name, org_code)')
  .eq('id', campaignId)
  .single();

Kyun rukta hai: Campaign ka organization code aur assigned users list check karta hai ki user ke paas is campaign ka access hai ya nahi.


3. Customer Lead Record (customers table)
File: 

pages/portal/campaign/[id]/[customerId].tsx:Line 1420
Time Taken: ~280 ms
Code:
typescript
const { data: cDataRows } = await supabase
  .from('customers')
  .select('*')
  .eq('id', idToFetch)
  .limit(1);
Kyun rukta hai: Customer ka naam (Krish), encrypted phone number, expiry date aur basic fields laane ke liye primary lead fetch.


4. Lead Manager Profile Lookup
File: 

pages/portal/campaign/[id]/[customerId].tsx:Line 1472
Time Taken: ~250 ms
Code:
typescript
const { data: mRows } = await supabase
  .from('user_profiles')
  .select('user_name, employee_id')
  .eq('user_id', foundCustomer.managed_by)
  .limit(1);
Kyun rukta hai: Lead card ke upar Manager ka naam aur Employee ID display karne ke liye yeh extra query chalai jaati hai.
5. CRM Call History API (/api/call/history)
File: 

pages/portal/campaign/[id]/[customerId].tsx:Line 1577
 ➔ 

pages/api/call/history.ts:Line 28
Time Taken: ~880 ms
Code:
typescript
const { data: historyData } = await supabaseAdmin
  .from('call_logs')
  .select(`
      *,
      agent:agent_id(user_name, employee_id),
      updater:last_updated_by(user_name, employee_id)
  `)
  .eq('customer_id', customerId)
  .order('created_at', { ascending: false });
Kyun rukta hai: Lead ke pichle saare call notes, dispositions, agent details aur 2 table joins (agent aur updater) fetch hote hain.
6. Mobile Call History (Sabse Bada Bottleneck 🚨)
File: 

pages/portal/campaign/[id]/[customerId].tsx:Line 1602
Time Taken: ~1,450 ms
Code:
typescript
const { data: mobileData, error: mobileError } = await supabase
  .from('call_history')
  .select('*')
  .or(`number.eq.${cleanPhone},number.ilike.%${cleanPhone}`)
  .order('timestamp', { ascending: false });
Kyun rukta hai:
call_history table me 6,56,360 rows hain!
Query me .ilike.%... laga hai, jisse Postgres database index use nahi kar pata aur poori 6.5 lakh rows ko ek-ek karke scan karta hai.
Iss customer ke 371 call logs match hote hain jinhe lane me 1.45 second lagta hai.
7. Mobile Logs Metadata Enrichment (N+1 Queries)
File: 

pages/portal/campaign/[id]/[customerId].tsx:Line 1618-1648
Time Taken: ~560 ms
Code:
typescript
// Query 7a: Agent IDs nikal kar user_profiles me search
supabase.from('user_profiles').select('employee_id, user_name').in('employee_id', empIds);
// Query 7b: Device IDs nikal kar sync_meta me search
supabase.from('sync_meta').select('device_id, device_model, employee_id').in('device_id', deviceIds);
// Query 7c: Agar koi employee_id bacha toh dobara user_profiles query
supabase.from('user_profiles').select('employee_id, user_name').in('employee_id', recoveredEmpIds);
Kyun rukta hai: Step 6 me jo 371 call logs aaye the, un logs me kaun sa agent tha aur kaun sa phone device tha, yeh pata lagane ke liye 2 se 3 extra round-trips hote hain.
8. Call Session State Check
File: 

pages/portal/campaign/[id]/[customerId].tsx:Line 1677
Time Taken: ~300 ms
Code:
typescript
const { data: currentSession } = await supabase
  .from('call_sessions')
  .select('*')
  .eq('user_id', user.uid)
  .eq('campaign_id', campaignId)
  .maybeSingle();
Kyun rukta hai: Check karta hai ki kya user pehle se kisi active call par hai ya lead par koi active timer chal raha hai.
⌛ Total Calculation:
  400ms (Query 1: Auth)
+ 430ms (Query 2: Campaign)
+ 280ms (Query 3: Customer)
+ 250ms (Query 4: Manager)
+ 880ms (Query 5: CRM History)
+ 1,450ms (Query 6: Mobile Logs - 6.5L rows scan)  <-- Sabse heavy!
+ 560ms (Query 7: Mobile Log Enrichment)
+ 300ms (Query 8: Call Session)
────────────────────────────────────────────────────────
= ~4,550ms - 5,200ms+ (Total blocking time before UI appears)
Aur yeh saari queries khatam hone ke baad hi line 1721 par setLoading(false) hota hai, tab jaa kar screen se spinner hat-ta hai!





| Query / Step | Pehle ka Time | Abhi ka Time | Status |
| :--- | :---: | :---: | :--- |
| **1. Auth Verification** | ~400 ms | **0 ms** | 🟢 **In-Memory (`UserContext`)** |
| **2. Campaign & Permissions** | ~430 ms | **Parallel** | 🟢 **`get_campaign_guard` RPC** *(Same camp me 0ms)* |
| **3. Customer Lead Record** | ~280 ms | **~250 – 280 ms** | 🟢 **Parallel in `Promise.all`** |
| **4. Lead Manager Profile** | ~250 ms | **0 ms** | 🟢 **In-Memory (`campData.users` lookup)** |
| **5. Call Session State Check** | ~300 ms | **Parallel** | 🟢 **Parallel in `Promise.all`** |
| **6. CRM History API** | ~880 ms | *Background* | 🟢 **Non-blocking (UI ke baad stream hota hai)** |
| **7. Mobile Logs (6.5L rows scan)** | ~1,450 ms | *Background* | 🟢 **Non-blocking (UI ke baad load hota hai)** |
| **8. Mobile Logs Enrichment** | ~560 ms | *Background* | 🟢 **Non-blocking (UI ke baad load hota hai)** |
| **TOTAL BLOCKING TIME (Loader)** | **~5,150 ms (~5.2s)** | ⚡ **~280 ms – 350 ms (<0.4s)** | 🚀 **~4.8 Seconds Saved (~93% Faster!)** |

---

## 🚀 5-Item Batching & Ghost Buffering Architecture (Completed & Deployed)

### 1. Timeline (Default Tab)
- **Initial Load:** Sirf latest 5 entries fetch hoti hain (`/api/call/history?customerId=...&limit=5&offset=0`).
- **Ghost Prefetch:** Jaise hi 5 entries render hoti hain, background me silent fetch next 5 entries ko React `timelineGhostBufferRef` me load kar leta hai.
- **View More Button:** Click karte hi buffer se **0ms perceived latency** me agle 5 items render hote hain aur agla ghost prefetch trigger hota hai.

### 2. Logs / Call History (Mobile Logs Tab)
- **Lazy Loaded:** Initial page load par 0ms consume karta hai. Tab click hone par hi fetch hota hai.
- **Index Accelerated:** Database par `idx_call_history_number` add hone se scan time 1,450ms se gir kar **1.2ms** ho chuka hai.
- **5-Item Window + Ghost Buffer:** First 5 rows render + next 5 rows ghost-buffered. Enrichment sirf 5 items ke agents aur devices par chalti hai (earlier 371 rows vs now 5 rows).

### 3. Schedules Tab
- **Lazy Loaded:** Tab click hone par latest 5 upcoming callbacks load hote hain.
- **Ghost Buffer:** Next 5 callbacks background buffer me rehte hain.
- **View More:** Filtered view ya date view par user "View More Schedules" / "Load More Schedules" click karke seamless expand kar sakta hai.

### 4. Smartflo Logs Tab
- **Lazy Loaded:** Provider `smartflo` hone par tab click hone par hi API hit hoti hai.
- **In-Memory Windowing:** `smartfloVisibleCount` initially 5 par capped rehti hai. "View More Smartflo Logs" button remaining entries ko +5 batches me reveal karta hai.







