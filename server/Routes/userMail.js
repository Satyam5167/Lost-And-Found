import express from 'express';
import pool from '../db.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import authMiddleware from '../middleware/authMiddleware.js';

dotenv.config();
const router = express.Router();

router.post('/sendClaimMail', authMiddleware, async (req, res) => {
    const claimerId = req.userId;
    const { id } = req.body;

    if (!claimerId || !id) {
        return res.status(400).json({ error: 'Missing claimer ID or item ID' });
    }

    try {
        const result = await pool.query(`
            SELECT 
              items.title,
              owner.email AS owner_email,
              claimer.email AS claimer_email,
              claimer.phone AS claimer_phone,
              claimer.name AS claimer_name
            FROM items
            JOIN users AS owner ON items.user_id = owner.id
            JOIN users AS claimer ON claimer.id = $1
            WHERE items.id = $2
        `, [claimerId, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Item or users not found' });
        }

        const { title, owner_email, claimer_email, claimer_phone, claimer_name } = result.rows[0];

        if (owner_email === claimer_email) {
            return res.status(400).json({ error: 'Owner And Claimer can not be same' });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.GMAIL_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.MY_EMAIL,
                pass: process.env.MY_EMAIL_PASS,
            },
        });



        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: owner_email,
            subject: `Claim Request for "${title}"`,
            html: `
        <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 650px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border: 1px solid #e0e0e0;">
            <div style="text-align: center; border-bottom: 1px solid #eaeaea; padding-bottom: 20px; margin-bottom: 30px;">
                <h1 style="color: #2c3e50; margin: 0;">🎯 Claim Notification</h1>
                <p style="color: #7f8c8d; font-size: 14px;">Trackit Back – Lost & Found Service</p>
            </div>

            <p style="font-size: 16px; color: #333;">Dear User,</p>

            <p style="font-size: 16px; color: #333;">
                We're reaching out to inform you that your listed item <strong style="color: #2980b9;">"${title}"</strong> has been claimed.
                Here are the details of the person who made the claim:
            </p>

            <div style="background-color: #f8f9fa; border-left: 4px solid #2980b9; padding: 15px 20px; margin: 20px 0; border-radius: 6px;">
            <p style="margin: 6px 0;"><strong>Name:</strong> ${claimer_name}</p>
            <p style="margin: 6px 0;"><strong>Email:</strong> <a href="mailto:${claimer_email}" style="color: #2980b9;">${claimer_email}</a></p>
            <p style="margin: 6px 0;"><strong>Phone Number:</strong> <a href="tel:${claimer_phone}" style="color: #2980b9;">${claimer_phone}</a></p>
            </div>

            <p style="font-size: 16px; color: #333;">
                Please contact the claimant directly to verify their request and coordinate the handover. If you have any doubts or need help, feel free to reach out to our support team.
            </p>

            <div style="margin-top: 40px;">
            <p style="font-size: 15px; color: #555;">Thanks for using <strong style="color: #27ae60;">Trackit Back</strong>! We’re here to help you recover what’s yours.</p>
            <p style="color: #888; margin-top: 20px;">Best regards,<br/>
            <em>– The Trackit Back Team</em></p>
            </div>
        </div>
`};


        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: 'Claim email sent successfully',
            owner_email,
            claimer_email
        });

    } catch (err) {
        console.error('❌ Error sending email:', err.message);
        res.status(500).json({ error: 'Failed to send claim email' });
    }
});

export default router;
