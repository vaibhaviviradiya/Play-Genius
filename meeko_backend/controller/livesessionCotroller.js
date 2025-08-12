const LiveSession = require('../model/livesession');
const jwt = require('jsonwebtoken');

exports.createLiveSession = async (req, res) => {
  try {
    const token = req.headers.authorization
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  //educator ni id 

    const livesession_data ={ ...req.body , created_by : decoded.educator_id , educator_name : decoded.educator_name};
   //ahiya jwt sign karti vakhte je educator no data pass karyo hoi ae destruct kari lese
    const newLiveSession = await LiveSession.create(livesession_data);

    res.status(201).json({ success: true, data: newLiveSession , message: 'Live session created successfully', });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
