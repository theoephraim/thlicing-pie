# Slice of DAO

### Slicing Pie implemented as a DAO - issue tokens to fairly track contributions towards a project (money and otherwise) while using token ownership to control governance of the project
## Inspiration

[Slicing Pie](https://slicingpie.com/) is a system that many startups and projects have used to track contributions in order to calculate a fair equity split. Currently people do this using a spreadsheet or a proprietary web app, with a single administrator/founder in total control.

By putting this system onto the blockchain, we can:
- give all shareholders transparency into how shares are issued
- use the ownership of these shares to create a DAO that can make decisions together
- give the company a shared "bank account" that can be controlled by the DAO to spend money or issue dividends to shareholders
- create instant liquidity for shareholders by allowing them sell their shares back to the organization or to outside investors

## What it does

Each share (called a "slice") represents the contribution of $1 (or equivalent) to the company.

- Contributions can be money - putting money into the shared pot, covering off-chain expenses.
- Contributions can be time - valued at the user's fair market rate.
- Contributions can be anything - ideas, relationships, rent, mileage on a car, etc.

We track these "slices" as ERC20 tokens in a smart contract that also provides governance mechanisms to the shareholders.

Shareholders can create proposals to issue shares to current shareholders or new contributors. In the future, some types proposals could be automated using time tracking software and evidence could be attached.
Shareholders then vote to approve or reject each proposal, with their "voting power" equal to their proportional share of the company pie (the total number of shares). Once the share of the votes has reached a certain threshold of approval (currently 70%) or the opposite rejection (30%), the outcome of the proposal is reached. If approved, the shares are issued. It is still up to the shareholders to evaluate the proposals fairly and be good citizens of the organization, but this removes total control from a single point of control and lets all shareholders have input.

Additionally, the company contract has a shared pool of funds. It could be funded by shareholders, donations, or by actual revenue flowing into the company. Users can make proposals to spend out of this pot, or to issue dividends to all shareholders. If a dividend proposal is approved, the entire pot is split according to the current shareholder percentages.

Lastly, shareholders can at any time "burn" tokens and sell their shares back to the company in exchange for money from the pot. This lets them extract their share at a 1:1 ratio to at least get their contribution back.

If everything is going well and there is additional speculative value more than the current sum of shares, they could also ask other shareholders or outside investors to purchase their shares at a higher value.
