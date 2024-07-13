import { query } from '../utils/db'
import { getAccount } from './accountHandler'

export const withdrawal = async (accountID: string, amount: number) => {
  const account = await getAccount(accountID)
  account.amount -= amount
  const res = await query(
    `
    UPDATE accounts
    SET amount = $1 
    WHERE account_number = $2`,
    [account.amount, accountID]
  )

  if (res.rowCount === 0) {
    throw new Error('Transaction failed')
  }

  await addTransaction(accountID, 'debit', amount)

  const t = await withdrawnToday(accountID)
  account.withdrawnToday = t

  return account
}

export const deposit = async (accountID: string, amount: number) => {
  const account = await getAccount(accountID)
  account.amount += amount
  const res = await query(
    `
    UPDATE accounts
    SET amount = $1 
    WHERE account_number = $2`,
    [account.amount, accountID]
  )

  if (res.rowCount === 0) {
    throw new Error('Transaction failed')
  }

  await addTransaction(accountID, 'credit', amount)

  return account
}

export const withdrawnToday = async (accountID: string) => {
  const res = await query(
    `
    SELECT SUM(amount) as debit_amount FROM transactions
    WHERE account_number = $1
    AND tx_date = CURRENT_DATE
    AND type = $2
    `,
    [accountID, 'debit']
  )

  return res.rows[0].debit_amount || 0
}

const addTransaction = async (
  accountID: string,
  type: 'credit' | 'debit',
  amount: number
) => {
  await query(
    `
      INSERT INTO transactions (account_number, type, amount)
      VALUES ($1, $2, $3)
    `,
    [accountID, type, amount]
  )
}
