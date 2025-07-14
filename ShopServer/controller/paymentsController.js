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
const responseUrl = "https://redvibes.store";
const confirmationUrl = "http://responseUrl/r2/confirmation";

// 🧮 Impuestos (simulados para pruebas)
const tax = 3193;

const getForm = async (req, res) => {
  res.sendFile(path.join(__dirname, "public", "form.html"));
};

const pay = async (req, res) => {
  try {
    const { phone, department, city, address, amount, email, documentId, fullName, items } = req.body;
    console.log('ENTROOOOO');

    if (!amount || !email || !documentId || !fullName || !items) {
      return res.status(400).send("Faltan datos");
    }

    const paymentsReference = generatePaymentReference();

    const signatureRaw = `${apiKey}~${merchantId}~${paymentsReference}~${amount}~${currency}`;
    const signature = crypto.createHash("md5").update(signatureRaw).digest("hex");

    const newOrder = new purchasedItemsSC({
      phone,
      department,
      city,
      address,
      documentId,
      items,
      state: 'pendiente',
    });

    
    await newOrder.save();
    console.log('newOrder', newOrder._id);

    const formHtml = `
      <html>
        <body>
           <form id="payuForm" method="post" action="https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/">
            <input name="merchantId"      type="hidden"  value="${merchantId}"   >
            <input name="accountId"       type="hidden"  value="${accountId}" >
            <input name="description"     type="hidden"  value="Pago en tienda RedVibes"  >
            <input name="extra1"          type="hidden"  value="${fullName}"   >
            <input name="extra2"          type="hidden"  value="${newOrder._id}"   >
            <input name="extra3"          type="hidden"  value="${documentId}"   >
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
    console.log('confirmation >>>', req.body);

    if(req.body.cc_holder === 'APPROVED' || req.body.cc_holder === 'PENDING') {

      let user = await usersSC.findOne({ documentId: body.extra3 });
      console.log('user', user);
      
      if (!user) {
        user = new usersSC({
          fullName: body.extra1,
          documentId: body.extra3,
          email: body.email_buyer
        });
        await user.save();
      }
  
      // Construir transacción con userId
      const transactionData = mapPayUTransaction(body, user._id);
      const transaction = new transactionSC(transactionData);
      await transaction.save();

      const newOrder = await purchasedItemsSC.findOne({ _id: req.body.extra2 });

      if (!newOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }
      newOrder.state = req.body.cc_holder === 'PENDING' ? newOrder.state = 'pendiente' : newOrder.state = 'aprobado';
      await newOrder.save();
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Error processing transaction:', err);
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
  return estado === 'APPROVED' ?
    'aprobado' : estado === 'REJECTED' ?
    'rechazado' : estado === 'PENDING' ?
    'pendiente' : 'desconocido';
}

function mapPayUTransaction(body, userId) {
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
    userId: userId,
    idBuys: body.extra2
  };
}

module.exports = {
  getForm,
  pay,
  responseurl,
  confirmation,
};
