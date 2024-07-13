import { Account } from '../Types/Account'

export const useDeposits = (account: Account) => {
  const depositFunds = async (depositAmount: Number) => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: depositAmount }),
    }
    const response = await fetch(
      `http://localhost:3000/transactions/${account.accountNumber}/deposit`,
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
    } as Account
  }

  return depositFunds
}
