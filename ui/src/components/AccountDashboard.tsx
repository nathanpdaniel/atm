import React, { ChangeEvent, useState } from 'react'
import { Account } from '../Types/Account'
import Paper from '@mui/material/Paper/Paper'
import { Button, Card, CardContent, Grid, TextField } from '@mui/material'
import { useWithdraws } from '../hooks/useWithdraws'
import { useDeposits } from '../hooks/useDeposits'

type AccountDashboardProps = {
  account: Account
  signOut: () => Promise<void>
}

export const AccountDashboard = (props: AccountDashboardProps) => {
  const [depositAmount, setDepositAmount] = useState(0)
  const [withdrawAmount, setWithdrawAmount] = useState(0)
  const [account, setAccount] = useState(props.account)
  const { validateWithdrawAmount, withdrawFunds } = useWithdraws(account)
  const { validateDepositAmount, depositFunds } = useDeposits(account)

  const [withdrawError, setWithdrawError] = useState('')
  const [depositError, setDepositError] = useState('')

  const handleChangeWithdrawAmount = (e: ChangeEvent<HTMLInputElement>) => {
    setWithdrawAmount(+e.target.value)
    setWithdrawError('')
  }

  const handleWithdrawFunds = async () => {
    try {
      const error = validateWithdrawAmount(withdrawAmount)
      if (error) {
        throw new Error(error)
      }

      const updatedAccount = await withdrawFunds(withdrawAmount)
      setAccount(updatedAccount)
    } catch (e) {
      setWithdrawError(String(e))
    }
  }

  const handleChangeDepositAmount = (e: ChangeEvent<HTMLInputElement>) => {
    setDepositAmount(+e.target.value)
    setDepositError('')
  }

  const handleDepositFunds = async () => {
    try {
      const error = validateDepositAmount(depositAmount)
      if (error) {
        throw new Error(error)
      }

      const updatedAccount = await depositFunds(depositAmount)
      setAccount(updatedAccount)
    } catch (e) {
      setDepositError(String(e))
    }
  }

  const { signOut } = props

  return (
    <Paper className="account-dashboard">
      <div className="dashboard-header">
        <h1>Hello, {account.name}!</h1>
        <Button variant="contained" onClick={signOut}>
          Sign Out
        </Button>
      </div>
      <h2>Balance: ${account.amount}</h2>
      <Grid container spacing={2} padding={2}>
        <Grid item xs={6}>
          <Card className="deposit-card">
            <CardContent>
              <h3>Deposit</h3>
              <TextField
                label="Deposit Amount"
                variant="outlined"
                type="number"
                sx={{
                  display: 'flex',
                  margin: 'auto',
                }}
                onChange={handleChangeDepositAmount}
                error={!!depositError}
                helperText={depositError}
              />
              <Button
                variant="contained"
                sx={{
                  display: 'flex',
                  margin: 'auto',
                  marginTop: 2,
                }}
                onClick={handleDepositFunds}
              >
                Submit
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card className="withdraw-card">
            <CardContent>
              <h3>Withdraw</h3>
              <TextField
                label="Withdraw Amount"
                variant="outlined"
                type="number"
                sx={{
                  display: 'flex',
                  margin: 'auto',
                }}
                onChange={handleChangeWithdrawAmount}
                error={!!withdrawError}
                helperText={withdrawError}
              />
              <Button
                variant="contained"
                sx={{
                  display: 'flex',
                  margin: 'auto',
                  marginTop: 2,
                }}
                onClick={handleWithdrawFunds}
              >
                Submit
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  )
}
