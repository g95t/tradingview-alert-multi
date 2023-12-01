# Differences within this version

Compared to the fantastic work of 0xIbuki (junta), I added the possibility to specify in the alert message (via the parameter 'exchID' [=1/2/3/4/5/6/everything else]) which dYdX account to operate with (up to a maximum of 6 different accounts plus the default one).

Original project: https://github.com/junta/tradingview-alert-connector

----------------------------------------------------------------

# Tradingview-Alert-Connector

Tradingview-Alert-Connector is a free and noncustodial tool for you to Integrate tradingView alert and execute automated trading for perpetual futures DEXes.

Currently supports [dYdX](https://dydx.exchange/) and [Perpetual Protocol](https://perp.com/).

# Docs

https://tv-connector.gitbook.io/docs/

# Video Tutorial

For dYdX:
https://www.youtube.com/watch?v=I8hB2O2-xx4

For Perpetual Protocol:
https://youtu.be/YqrOZW_mnUM

# Prerequisites

- TradingView Account at least Pro plan

https://www.tradingview.com/gopro/

- dYdX or Perpetual Protocol account with collateral already in place

# Installation

```bash
git clone https://github.com/junta/tradingview-alert-connector.git
cd tradingview-alert-connector
npm install --force
```

# Quick Start

- rename .env.sample to .env
- fill environment variables in .env (see [full tutorial](https://tv-connector.gitbook.io/docs/setuup/running-on-local-pc#steps))

### with Docker

```bash
docker-compose build
docker-compose up -d
```

### without Docker

```bash
yarn start
```

## Disclaimer

This project is hosted under an MIT OpenSource License. This tool does not guarantee users’ future profit and users have to use this tool on their own responsibility.
