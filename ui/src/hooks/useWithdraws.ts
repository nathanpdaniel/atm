import { Account } from '../Types/Account'

export const useWithdraws = (account: Account) => {
  const validateWithdrawAmount = (amount: number) => {
    if (amount > 200) {
      throw new Error('Maximum withdraw amount is $200')
    }

    if (account.withdrawnToday + amount > 400) {
      throw new Error('Maximum daily withdraw amount is $400')
    }

    if (amount % 5 !== 0) {
      throw new Error('Withdraw amount must be in increments of $5')
    }

    if (
      account.type === 'credit' &&
      account.amount + account.creditLimit < amount
    ) {
      throw new Error('The requested amount exceeds credit limit')
    } else if (account.amount < amount) {
      throw new Error('The requested amount exceeds available funds')
    }
  }

  const withdrawFunds = async (withdrawAmount: number): Promise<Account> => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: withdrawAmount }),
    }
    const response = await fetch(
      `http://localhost:3000/transactions/${account.accountNumber}/withdraw`,
      requestOptions
    )
    const data = await response.json()

    if (data.error) {
      throw new Error(data.error)
    }

    return {
      accountNumber: data.account_number,
      name: data.name,
      amount: data.amount,
      type: data.type,
      creditLimit: data.credit_limit,
      withdrawnToday: data.withdrawnToday,
    } as Account
  }

  return { validateWithdrawAmount, withdrawFunds }
}
