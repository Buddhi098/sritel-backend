const {INSERT, UPDATE, SELECT, DELETE, QUERY, SELECT_WHERE} = require('../../models/Server_4_DB');
const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51O934qEl5EhYFgAyD66NQJFZB1ylROUeSjdLugkk7wk6wUfyBp8ZxVZs3ZvcHHSCEG52rUFHqEMAl3rlkq4xiDjP00ZJsS81kX');

router.post('/paymentFromBill', async  (req, res) => 
{
	try {
		const row_id = req.body.id;
		const amount = req.body.amount;	
		const user_id = req.body.user_id;
		const package_id = req.body.package_id;
		const currency = 'lkr';
		const confirm = 'true';

		const response = await QUERY(`INSERT INTO payments(user_id, amount, currency, package_id, confirm) VALUES('${user_id}', '${amount}', '${currency}', '${package_id}', '${confirm}')`);

		if (response != null) 
		{
			const change_status = await UPDATE(`UPDATE user_bill SET paid_unpaid = 'paid' WHERE id = '${row_id}' AND user_id = '${user_id}' AND package_id = '${package_id}'`);
			if (change_status.affectedRows > 0) 
			{
				res.send({ type: 'success', message: 'Bill status updated to paid' });
			} 
			else 
			{
				res.send({ type: 'error', message: 'No matching record found' });
			}
		} 
		else 
		{
			res.send('unsuccessful');
		}
	} catch (e) {
		res.send('error');
	}
});

router.post('/paymentDirecly', async  (req, res) => 
	{
		try {
			// const row_id = req.body.id;
			const amount = req.body.amount;	
			const user_id = req.body.user_id;
			const package_id = req.body.package_id;
			const currency = 'lkr';
			const confirm = 'true';
	
			const response = await QUERY(`INSERT INTO payments(user_id, amount, currency, package_id, confirm) VALUES('${user_id}', '${amount}', '${currency}', '${package_id}', '${confirm}')`);
	
			if (response != null) 
			{
				const paid_unpaid = 'paid';
				
				const change_status = await QUERY(`INSERT INTO user_bill(user_id, package_id, price, paid_unpaid) VALUES('${user_id}', '${package_id}', '${amount}', '${paid_unpaid}')`);
				if (change_status.affectedRows > 0) 
				{
					res.send({ type: 'success', message: 'Bill status updated to paid' });
				} 
				else 
				{
					res.send({ type: 'error', message: 'No matching record found' });
				}
			} 
			else 
			{
				res.send('unsuccessful');
			}
		} catch (e) {
			res.send('error');
		}
	});

router.post('/directActivatePackage', async (req, res) => {
    try {
		const row_id = req.body.id;
		const amount = req.body.amount;	
		const user_id = req.body.user_id;
		const package_id = req.body.package_id;
		const currency = 'lkr';
		const confirm = 'true';

		const response = await QUERY(`INSERT INTO payments(user_id, amount, currency, package_id, confirm) VALUES('${user_id}', '${amount}', '${currency}', '${package_id}', '${confirm}')`);

		if (response != null) 
		{
			const change_status = await UPDATE(`UPDATE user_bill SET paid_unpaid = 'paid' WHERE id = '${row_id}' AND user_id = '${user_id}' AND package_id = '${package_id}'`);
			if (change_status.affectedRows > 0) 
			{
				res.send({ type: 'success', message: 'Bill status updated to paid' });
			} 
			else 
			{
				res.send({ type: 'error', message: 'No matching record found' });
			}
		} 
		else 
		{
			res.send('unsuccessful');
		}
	} catch (e) {
		res.send('error');
	}
});


module.exports = router;
