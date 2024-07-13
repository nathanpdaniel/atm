import { query } from '../utils/db'
import { withdrawnToday } from './transactionHandler'

export const getAccount = async (accountID: string) => {
  const res = await query(
    `
    SELECT account_number, name, amount, type, credit_limit 
    FROM accounts 
    WHERE account_number = $1`,
    [accountID]
  )

  if (res.rowCount === 0) {
    throw new Error('Account not found')
  }

  const account = res.rows[0]

  const txRes = await withdrawnToday(accountID)
  account.withdrawnToday = txRes

  return account
}
