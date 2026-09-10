import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const CLINIC_EMAIL = "kashafkashaf842@gmail.com";
const EMAIL_SUBJECT = "New Appointment Booking – Mother Care Clinic";

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildEmailHtml(data) {
  const rows = [
    { label: "Patient Name", value: data.patient_name },
    { label: "Phone Number", value: data.phone },
    { label: "Email", value: data.email || "—" },
    { label: "Age", value: data.age != null ? data.age : "—" },
    { label: "Doctor", value: data.doctor },
    { label: "Service", value: data.service },
    { label: "Appointment Date", value: data.appointment_date },
    { label: "Reason for Visit", value: data.reason || "—" },
  ];

  const rowsHtml = rows
    .map(
      (r) => `
      <tr>
        <td style="padding:10px 20px 10px 0;font-family:Inter,Arial,sans-serif;font-size:14px;color:#5C7480;font-weight:500;white-space:nowrap;vertical-align:top;width:180px;">${escapeHtml(r.label)}</td>
        <td style="padding:10px 0;fontamily:Inter,Arial,sans-serif;font-size:14px;color:#1A2E35;font-weight:600;vertical-align:top;">${escapeHtml(r.value)}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#F7F9F9;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F9F9;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(26,46,53,0.08);">

        <!-- Header -->
        <tr>
          <td style="background-color:#2B4C5C;padding:28px 36px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-family:Fraunces,Georgia,serif;font-size:22px;font-weight:600;color:#FFFFFF;">Mother Care Clinic</td>
              </tr>
              <tr>
                <td style="font-family:Inter,Arial,sans-serif;font-size:13px;color:#CBDADE;padding-top:4px;">Compassionate maternity &amp; women's care</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px;">
            <h1 style="font-family:Fraunces,Georgia,serif;font-size:24px;font-weight:600;color:#1A2E35;margin:0 0 8px;">New Appointment Booking</h1>
            <p style="font-family:Inter,Arial,sans-serif;font-size:15px;color:#5C7480;line-height:1.6;margin:0 0 28px;">A patient has submitted a new appointment request through the website. Please review the details below and contact the patient to confirm their slot.</p>

            <!-- Info card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F9F9;border-radius:12px;border:1px solid #DCE4E4;">
              <tr><td style="padding:8px 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${rowsHtml}
                </table>
              </td></tr>
            </table>

            <p style="font-family:Inter,Arial,sans-serif;font-size:13px;color:#5C7480;line-height:1.6;margin:28px 0 0;">This is an automated notification from the Mother Care Clinic website booking form.</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color:#EFF3F3;padding:20px 36px;border-top:1px solid #DCE4E4;">
            <p style="font-family:Inter,Arial,sans-serif;font-size:12px;color:#7E98A0;margin:0;text-align:center;">© 2026 Mother Care Clinic. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const data = await req.json();

    const required = ["patient_name", "phone", "doctor", "service", "appointment_date"];
    const missing = required.filter((k) => !data[k]);
    if (missing.length > 0) {
      return new Response(
        JSON.stringify({ error: `Missing required fields: ${missing.join(", ")}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const html = buildEmailHtml(data);

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Mother Care Clinic <onboarding@resend.dev>",
        to: [CLINIC_EMAIL],
        subject: EMAIL_SUBJECT,
        html,
      }),
    });

    if (!emailResponse.ok) {
      const errText = await emailResponse.text();
      console.error("Resend API error:", emailResponse.status, errText);
      return new Response(
        JSON.stringify({ error: "Failed to send email notification" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Email notification sent" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err.message);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
