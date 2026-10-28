
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const {
      name,
      email,
      contact,
      project,
      goal,
      investment,
      message
    } = req.body || {};

    if (!name || !email || !project || !goal) {
      return res.status(400).json({
        error: "Completa los campos obligatorios."
      });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Henry Díaz Website <contato@henrydiaz.com.br>",
        to: ["genri.diaz.ti@gmail.com"],
        reply_to: email,
        subject: `Nueva solicitud de presupuesto: ${project}`,
        text: [
          "Nueva solicitud desde henrydiaz.com.br",
          "",
          `Nombre: ${name}`,
          `Email: ${email}`,
          `Contacto: ${contact || "No indicado"}`,
          `Proyecto: ${project}`,
          `Objetivo: ${goal}`,
          `Inversión: ${investment || "No indicado"}`,
          `Mensaje: ${message || "Sin mensaje"}`
        ].join("\n")
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Resend error:", result);
      return res.status(500).json({
        error: "No se pudo enviar la solicitud."
      });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      error: "Error interno al enviar la solicitud."
    });
  }
}
