const payload = {
  uuid: "6abd6a43699d4",
  ref_id: "01a0f3e7-1767-70b3-afc8-901a4f999f82",
  billsec: "0",
  call_id: "HYD1-D4-1790798403.486134",
  duration: "0",
  call_flow: [],
  direction: "clicktocall",
  end_stamp: "2026-10-01 01:30:19",
  queue_name: "",
  reason_key: "",
  call_status: "missed",
  campaign_id: "",
  start_stamp: "2026-10-01 01:30:03",
  answer_stamp: "",
  missed_agent: [
    {
      id: "0507733050004",
      name: "Nidhi",
      number: "+916392700613",
      agent_number: "+916392700613"
    }
  ],
  outbound_sec: "0",
  campaign_name: "",
  digits_dialed: "",
  recording_url: "",
  answered_agent: "",
  billing_circle: {
    circle: "Punjab",
    operator: "TTL"
  },
  call_connected: "0",
  call_to_number: "9217175080",
  agent_ring_time: "13",
  caller_id_number: "8065605914",
  hangup_cause_key: "NO_ANSWER",
  custom_identifier: "test-002",
  hangup_cause_code: "19",
  customer_ring_time: "",
  answered_agent_name: "",
  answered_agent_number: "",
  broadcast_lead_fields: "",
  agent_transfer_ring_time: "",
  "customer_no_with_prefix ": "9217175080",
  hangup_cause_description: "No answer from user (user alerted)",
  aws_call_recording_identifier: ""
};

async function main() {
  const res = await fetch('http://localhost:3000/webhook/org/82988d1b-5a42-4aab-aa80-be818ebfc4d2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Response:', data);
}

main().catch(console.error);
