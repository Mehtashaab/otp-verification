import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import OTP from '../models/otp.model.js';
import { sendVerificationEmail } from '../utils/mailSender.js'; 
import otpGenerator from 'otp-generator';

// Registration logic
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, and password.',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered. Please log in.',
      });
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'User registered successfully! You can now log in.',
    });
  } catch (error) {
    console.error('Error in registration process:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
};

// Login logic
const login = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email.',
      });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please register first.',
      });
    }

    // Generate OTP for login
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Save OTP to the database
    const otpPayload = { email, otp };
    await OTP.create(otpPayload);

    // Send OTP to the user's email
    await sendVerificationEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: 'OTP sent to your email successfully.',
    });
  } catch (error) {
    console.error('Error in login process:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
};

// Verify OTP for registration or login
const verifyOtp = async (req, res) => {
    try {
      const { email, otp } = req.body;
  
      // Validate input
      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: 'Please provide your email and OTP.',
        });
      }
  
      // Fetch the latest OTP entry for the provided email
      const latestOtpEntry = await OTP.findOne({ email }).sort({ createdAt: -1 });
  
      // If no OTP entry is found or OTP does not match
      if (!latestOtpEntry) {
        return res.status(404).json({
          success: false,
          message: 'No OTP found for this email. Please request a new one.',
        });
      }
  
      if (latestOtpEntry.otp !== otp) {
        return res.status(400).json({
          success: false,
          message: 'Invalid OTP. Please try again.',
        });
      }
  
      // Check if OTP is expired (assuming OTP is valid for 5 minutes)
      const currentTime = new Date().getTime();
      const otpTime = new Date(latestOtpEntry.createdAt).getTime();
      const expiryTime = 5 * 60 * 1000; // 5 minutes in milliseconds
  
      if (currentTime - otpTime > expiryTime) {
        return res.status(400).json({
          success: false,
          message: 'OTP has expired. Please request a new one.',
        });
      }
  
      // If the OTP is valid, remove it from the database
      await OTP.deleteMany({ email });
  
      return res.status(200).json({
        success: true,
        message: 'OTP verified successfully!',
        user: { email }, // Return user data if needed
      });
    } catch (error) {
      console.error('Error verifying OTP:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Internal server error. Please try again later.',
      });
    }
  };
  

export { register, login, verifyOtp };
