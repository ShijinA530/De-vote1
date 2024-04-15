const User = require('../models/user');
const Candidate = require('../models/candidate');
const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { generateRandomPassword } = require('../utils/passwordGenerator');
const nodemailer = require('nodemailer');
const Po = require('../models/po');



module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Assuming User model is imported properly
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ error: 'User does not exist.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, 'eth-voting', { expiresIn: '1h' });

        // Set the JWT token as a cookie
        res.status(200).json({ token, userType : 'voter' }); // 1 hour expiration time
        // Log the cookie to console for testing
        console.log('JWT token sent to the client:', token);

        // Send a response to the client
        // res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports.candidate_post = async (req, res) => {
    const { firstName, middleName, lastName, department, electionType, party } = req.body;

    try {
        const candidate = await Candidate.create({ firstName, middleName, lastName, department, electionType, party });
        
        res.status(201).json({ candidate });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
};

module.exports.candidate_get = async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.json(candidates);
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.candidate_delete_post = async (req, res) => {
    const { candidateID } = req.body;

    try {
        const deletedCandidate = await Candidate.findOneAndDelete({ candidateID });

        if (!deletedCandidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        
        res.status(200).json({ message: 'Candidate deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports.voter_get = async (req, res) => {
    try {
        // Fetch all voter data from the database
        const voters = await User.find();

        // Send the fetched voter data as a JSON response
        res.json(voters);
    } catch (error) {
        // Handle errors
        console.error('Error fetching voter data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to send email using nodemailer
const sendEmail = async (email, password) => {
  // Create a transporter
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'devoteotp@gmail.com', // Your Gmail email address
      pass: 'rdlg fqyn akws cnmv', // Your Gmail password
    },
  });

  // Send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Devote App" devoteotp@gmail.com', // Sender address
    to: email, // List of recipients
    subject: 'Your Password for Voter Data Access', // Subject line
    text: `Here is your password for accessing voter data: ${password}`, // Plain text body
    // html: '<b>Hello world?</b>', // Html body (if needed)
  });

  console.log('Message sent: %s', info.messageId);
};

module.exports.voter_add_post = async (req, res) => {
  try {
    const voterData = req.body;

    voterData.shift();

    for (const entry of voterData) {
      const [ktuID, name, department, year, email] = entry;
      const password = generateRandomPassword();

      // Send email with password
      await sendEmail(email, password);

      // Add user to MongoDB
      await User.create({ email, ktuid: ktuID, password, name, department, year });
    }

    res.status(201).json({ message: 'Voter data added successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};


module.exports.admin_login_post = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);

    try {
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(400).json({ error: 'Admin does not exist.' });
        }
        const passwordMatch = await bcrypt.compare(password, admin.password);

        if (!passwordMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ adminId: admin._id, userType: 'admin' }, 'your_secret_key', { expiresIn: '1h' });
        

        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 }); 

        res.status(200).json({ token, userType: 'admin' });
        console.log('JWT token sent to the client:', token);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};


module.exports.election_type_get = async (req, res) => {
    try {
        const electionTypes = await Candidate.distinct('electionType');
        res.status(200).json({ electionTypes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports.type_candidate_get = async (req, res) => {
    try {
        const { electionType } = req.body;
        
        // Query candidates based on the provided electionType
        const candidates = await Candidate.find({ electionType });

        if (candidates.length === 0) {
            return res.status(404).json({ message: 'No candidates found for the provided election type.' });
        }

        // Return the found candidates
        res.status(200).json({ candidates });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports.all_candidate_get = async (req, res) => {
    try {
        const uniqueElectionTypes = await Candidate.distinct('electionType');

        const candidatesByType = {};

        for (const type of uniqueElectionTypes) {
            const candidates = await Candidate.find({ electionType: type });

            const candidateNames = candidates.map(candidate => `${candidate.firstName} ${candidate.middleName ? candidate.middleName + ' ' : ''}${candidate.lastName}`);

            candidatesByType[type] = candidateNames;
        }

        // Return the result as JSON
        res.status(200).json(candidatesByType);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
module.exports.dashboard_get = async (req, res) => {
    try {
        // Retrieve total number of registered users
        const totalUsers = await User.countDocuments();

        // Retrieve unique election types
        const uniqueElectionTypes = await Candidate.distinct('electionType');

        // Count the number of unique election types
        const numElectionTypes = uniqueElectionTypes.length;

        // Return the data
        res.status(200).json({ totalUsers, numElectionTypes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};


exports.po_login_post = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const po = await Po.findOne({ email });
  
      if (!po) {
        return res.status(400).json({ error: 'PO does not exist.' });
      }
  
      const passwordMatch = await bcrypt.compare(password, po.password);
  
      if (!passwordMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ poId: po._id }, 'your_secret_key', { expiresIn: '1h' });
  
      res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });
  
      res.status(200).json({ token, userType:'po' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
};

module.exports.po_signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingPo = await Po.findOne({ email });

        if (existingPo) {
            return res.status(400).json({ error: 'PO already exists with this email.' });
        }

        const newPo = await Po.create({ email, password });
        res.status(201).json({ po: newPo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// delete all collection

// async function deleteAllData() {
//     try {
//         const result = await User.deleteMany({});
//         console.log(`${result.deletedCount} documents deleted successfully.`);
//     } catch (error) {
//         console.error('Error deleting documents:', error);
//     }
// }

// deleteAllData();