import { account } from '../Types/Account'

export const useWithdraws = (account: account) => {
  const validateWithdrawAmount = (amount: number): boolean => {
    if (amount > 200) {
      return false
    }

    if (amount > 400) {
      return false
    }

    if (amount % 5 !== 0) {
      return false
    }

    return true
  }

  const withdrawFunds = async (withdrawAmount: number): Promise<account> => {
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
    return {
      accountNumber: data.account_number,
      name: data.name,
      amount: data.amount,
      type: data.type,
      creditLimit: data.credit_limit,
      withdrawnToday: data.withdrawnToday,
    } as account
  }

  return withdrawFunds
}
