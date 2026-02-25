const { response } = require("./helpers/dataResponse");
const crypto = require("crypto");
const { usersSC } = require("../database/models/users.schema");
const { transactionSC } = require("../database/models/transaction.schema");
const { purchasedItemsSC } = require("../database/models/purchasedItems.schema");

const merchantId = "1025519";
const accountId = "1034697";
const apiKey = "CQqqQ9UDyzr8GvybgK8lSSD5Rt";
const currency = "COP";
const test = "1";
const responseUrl = "http://localhost:4200/shop/checkout";
const confirmationUrl = "https://b2e0fe228015.ngrok-free.app/r2/confirmation";

const getForm = async (req, res) => {
  res.sendFile(path.join(__dirname, "public", "form.html"));
};

const pay = async (req, res) => {
  try {
    const { phone, department, city, address, amount, email, documentId, fullName, items } = req.body;
    console.log("Entro PAY() datos: ", req.body);

    if (!Object.keys(req.body).length) {
      response(res, {
        msg: "Faltan campos obligatorios",
        statusCode: 400,
        error: "Campos obligatorios",
      });
    }
    const paymentsReference = generatePaymentReference();
    const signatureRaw = `${apiKey}~${merchantId}~${paymentsReference}~${amount}~${currency}`;
    const signature = crypto.createHash("md5").update(signatureRaw).digest("hex");
    console.log(generatePaymentReference());
    console.log(signature);

    const newOrder = new purchasedItemsSC({
      phone,
      department,
      city,
      address,
      documentId,
      items,
      state: "pendiente",
    });

    await newOrder.save();
    console.log("newOrder", newOrder._id);

    let user = await usersSC.findOne({ documentId: documentId });
    console.log("user", user);

    if (!user) {
      user = new usersSC({
        fullName: fullName,
        documentId: documentId,
        email: email,
        phone: phone,
      });
      await user.save();
    }
    const formHtml = `
      <html>
        <body>
           <form id="payuForm" method="post" action="https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/">
            <input name="merchantId"      type="hidden"  value="${merchantId}"   >
            <input name="accountId"       type="hidden"  value="${accountId}" >
            <input name="description"     type="hidden"  value="Pago en tienda RedVibes"  >
            <input name="extra1"          type="hidden"  value="${user._id}"   >
            <input name="extra2"          type="hidden"  value="${newOrder._id}"   >
            <input name="referenceCode"   type="hidden"  value="${paymentsReference}" >
            <input name="amount"          type="hidden"  value="${amount}"   >
            <input name="tax"             type="hidden"  value="0"  >
            <input name="currency"        type="hidden"  value="COP" >
            <input name="signature"       type="hidden"  value="${signature}"  >
            <input name="test"            type="hidden"  value="${test}" >
            <input name="buyerEmail"      type="hidden"  value="${email}" >
            <input name="confirmationUrl" type="hidden"  value="${confirmationUrl}" >
            <input name="responseUrl"     type="hidden"  value=${responseUrl} >
            input name="Submit"           type="submit"  value="Send" >
          </form>
        </body>
      </html>
    `;

    response(res, { payload: formHtml });
  } catch (err) {
    console.error("❌ Error generando WebCheckout:", err);
    res.status(500).send("Error generando WebCheckout");
  }
};

// Recepción de respuesta desde PayU (navegador)
const responseurl = async (req, res) => {
  res.send("Gracias por tu compra. Revisa tu correo para más detalles.");
};

async function confirmation(req, res) {
  try {
    const body = req.body;
    console.log("confirmation >>>", req.body);

    if (req.body.cc_holder === "APPROVED" || req.body.cc_holder === "PENDING") {
      // Construir transacción con userId
      const transactionData = mapPayUTransaction(body);
      const transaction = new transactionSC(transactionData);
      await transaction.save();

      const newOrder = await purchasedItemsSC.findOne({ _id: req.body.extra2 });

      if (!newOrder) {
        return res.status(404).json({ error: "Order not found" });
      }
      newOrder.state = req.body.cc_holder === "PENDING" ? (newOrder.state = "pendiente") : (newOrder.state = "aprobado");
      await newOrder.save();
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Error processing transaction:", err);
    res.sendStatus(500);
  }
}

function generatePaymentReference() {
  const now = new Date().toISOString();
  const hash = crypto.createHash("md5").update(now).digest("hex");
  return hash.slice(0, 8).toUpperCase();
}

function normalizeState(msg) {
  const estado = msg?.toUpperCase();
  return estado === "APPROVED" ? "aprobado" : estado === "REJECTED" ? "rechazado" : estado === "PENDING" ? "pendiente" : estado;
}

function mapPayUTransaction(body) {
  console.log(body);
  return {
    reference: body.reference_sale,
    transactionId: body.transaction_id,
    state: normalizeState(body.response_message_pol),
    responseCode: body.response_code_pol,
    responseMessage: body.response_message_pol,
    paymentMethod: body.payment_method_name,
    paymentMethodId: body.payment_method_id,
    franchise: body.franchise,
    value: parseFloat(body.value),
    currency: body.currency,
    installments: parseInt(body.installments_number),
    createdAt: new Date(body.transaction_date),
    userId: body.extra1,
    idBuys: body.extra2,
  };
}

module.exports = {
  getForm,
  pay,
  responseurl,
  confirmation,
};
