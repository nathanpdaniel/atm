Wrap Up

## Questions

### What issues, if any, did you find with the existing code?

1. The commands given on how the project will be run (`docker run build` and then `docker compose up -d`) seem to be off - `docker run build` should be `docker compose build`, I assume (so I did update the README and used that instead).

### What issues, if any, did you find with the request to add functionality?

1. For withdrawing from credit accounts, there's a lack of clarification on how those should be handled. I chose to assume credit_limit was the most amount a user could borrow in total but the directions could be interpreted as your credit limit is the amount you can withdraw. It does not mention or clarify that it would be a sum of two fields to determine the remaining amount. I will also say, it seems like a safe assumption that is how it should work but, in any case, it is not explicit. I write the software based on business decisions. As clear as I might believe it to be, rules surrounding business logic should not be left at the developers discretion but should be confirmed with the appropriate parties.

### Would you modify the structure of this project if you were to start it over? If so, how?

Yes. To start, I would much prefer to run the different aspects of this individually. In order to make a change, and have the change be reflected in the application, you have to shut down, rebuild and restart the docker container(s). It's not a difficult task to accomplish but is time consuming. I believe I spent more time waiting on this process than I did making code changes.
That being said, this project is also based of create react app which has largly been deprecated in favor of newer tooling. Vite, Next, or Remix are most popular options (today at least) depending on long term goals. My (opinionated) preference is Vite.

### Were there any pieces of this project that you were not able to complete that you'd like to mention?

No, not that I am aware of.

### If you were to continue building this out, what would you like to add next?

- A ledger or some sort of transaction history (even if it's truncated)
- Better form validation and updating forms
- Add tests throughout
- Add Storybook to help with component development
- My preference is to seperate concerns a bit more than what is here. As it stands, the components are pretty tightly coupled to services. For an app this size, it's not that big of an issue but scaling up, it's definitely something I'd want to pursue.
- We could also break down the UI into more components. There are only 2 right now but quite a bit of duplicated code, and code very familiar throughout the components (meaning, it's very similar but not quite the same).
- Expand accounts. As is, you see "John's checking account" and "John's savings account". John is the owner of both accounts but neither the API nor the DB associate these accounts with the same user. We could do something like create a `user` table, then modify our `accounts` table to allow users to have multiple accounts with a single auth point; still log in with account number but the system knows all associated accounts. This would also allow even more functionality (see next point).
- More functionality. Right now, you can see your balance, deposit and withdraw money. If the above updates are made, we can expand to switching accounts, making transfers between accounts, adding something like "quick" withdrawals (user logs in, user given a set of predefined amounts to quickly click a button and retreive that amount of money)

### If you have any other comments or info you'd like the reviewers to know, please add them below.

The only comment, I'd like to reiterate, based on the README, the `docker run build` command will _not_ work but `docker compose build` will. It could certainly be intentionally done that way to guage my knowledge/understanding of docker but, there was no documentation I could find that would make it make sense to me... without creating an image actually called `build` - which I think would be odd and _not_ what was intended. Especially given the ease of every other aspect of this assessment.
As well, if you care to look, I did utilize PRs on the repo to break down the work into commits around specific areas of change.
