import { query } from '../utils/db'
import { getAccount } from './accountHandler'

export const withdrawal = async (accountID: string, amount: number) => {
  const account = await getAccount(accountID)

  validateWithdraw(account, amount)

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

  validateDeposit(account, amount)

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

  return parseInt(res.rows[0].debit_amount, 10) || 0
}

const validateWithdraw = (account: any, withdrawAmount: number) => {
  // max $200 per transaction
  if (withdrawAmount > 200) {
    throw new Error('Maximum withdraw amount is $200')
  }

  // max $400 per day
  if (account.withdrawnToday + withdrawAmount > 400) {
    throw new Error('Maximum daily withdraw amount is $400')
  }

  // must be increment of $5
  if (withdrawAmount % 5 !== 0) {
    throw new Error('Withdraw amount must be in increments of $5')
  }

  // funds available
  if (['savings', 'checking'].includes(account.type)) {
    confirmNonCreditFunds(account.amount, withdrawAmount)
  } else {
    confirmAvailableCredit(account.amount, account.credit_limit, withdrawAmount)
  }
}

const confirmNonCreditFunds = (
  currentAmount: number,
  withdrawAmount: number
) => {
  if (currentAmount < withdrawAmount) {
    throw new Error('The requested amount exceeds available funds.')
  }
}

/**
 * This makes an assumption that the sum of the credit limit and current amount on an account determine how much can be withdrawn
 * As it is worded, it could be considered any amount up to the credit limit could be withdrawn, whether the user has the funds available
 * ie. Credit limit is $1000 and the current amount is $-900. If a user requests a withdrawl of $200, the credit limit would be crossed, in which case,
 * the assumption is made the transaction should be declined.
 */
const confirmAvailableCredit = (
  currentAmount: number,
  creditLimit: number,
  withdrawAmount: number
) => {
  const amount = currentAmount + creditLimit
  if (amount < withdrawAmount) {
    throw new Error('The requested amount exceeds credit limit')
  }
}

const validateDeposit = (account: any, depositAmount: number) => {
  if (depositAmount > 1000) {
    throw new Error('The maximum deposit amount is $1000')
  }

  if (account.type === 'credit' && account.amount + depositAmount > 0) {
    throw new Error(
      'The maximum deposit amount cannot exceed the current balance'
    )
  }
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
