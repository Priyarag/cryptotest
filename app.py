from flask import Flask, jsonify, render_template
import json
import numpy as np
import pandas as pd
import decimal
import datetime

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from sqlalchemy import Column, Integer, String, DECIMAL, DateTime, cast, Date, and_


def alchemyencoder(obj):
   if isinstance(obj, datetime.date):
       return obj.isoformat()
   elif isinstance(obj, decimal.Decimal):
       return float(obj)


engine = create_engine('mysql://flask:flasktest@awsflask.cpmhfsqdvkzl.us-east-2.rds.amazonaws.com/innodb')
session = Session(engine)
# Reflect Database into ORM class
Base = automap_base()
Base.prepare(engine, reflect=True)
Crypto_Table = Base.classes.crypto
session = Session(engine)
app = Flask(__name__, template_folder="templates")

file = "static/data/historical_data_final.csv"
historical_df = pd.read_csv(file)

currency_list = {
        "XRP" : 1,
        "ETH" : 2, 
        "LTC" : 3, 
        "BCC" : 4, 
        "EOS" : 5, 
        "BNC" : 6
        }   


@app.route("/")
def index():
    return render_template('index.html')

@app.route("/explore")
def explore():
    return render_template('explore.html')
    
@app.route("/history")
def history():
    return render_template('history.html')

@app.route("/comparison")
def comparison():
    return render_template('comparison.html')




'''
The following routes are for calling the historical data API 
of each ETC and plotting the data in JS.
'''

@app.route("/BTC")
def names():
    """Return a list of BTC names."""
    return (jsonify(list(currency_list)))
    
@app.route("/historical_data/<correctedCurrency>")
def historical_data(correctedCurrency):
    currency_data = historical_df.loc[historical_df["correctedCurrency"] == correctedCurrency]

    data = {
        "Date": currency_data["Date"].tolist(),
        "Close": currency_data["Close"].tolist(),
    }

    return jsonify(data)


# @app.route("/livedata/<firstCurrency>/<dateTimeInput1>")
# #/<firstCurrency>&<secondCurrency>&<dateTimeInput1>&<dateTimeInput2>")
# def collect_data(firstCurrency=None,dateTimeInput1=None):

#     results = session.query(Crypto_Table.symbol, Crypto_Table.price, cast(Crypto_Table.crypto_timestamp,DateTime))\
#     .filter(Crypto_Table.symbol == firstCurrency).\
#     filter(cast(Crypto_Table.crypto_timestamp, DateTime) >= dateTimeInput1).\
#     limit(5).all()


@app.route('/livedata/<userSelectedCrypto1>/<userSelectedCrypto2>/<userSelectedDateTime1>/<userSelectedDateTime2>')
def collectData(userSelectedCrypto1=None,userSelectedCrypto2=None,userSelectedDateTime1=None,userSelectedDateTime2=None):

    results1 = session.query(Crypto_Table.symbol, Crypto_Table.price, cast(Crypto_Table.crypto_timestamp,DateTime))\
        .filter(Crypto_Table.symbol == userSelectedCrypto1).filter(and_(Crypto_Table.crypto_timestamp >= userSelectedDateTime1),(Crypto_Table.crypto_timestamp <= userSelectedDateTime2)).all(),\
        session.query(Crypto_Table.symbol, Crypto_Table.price, cast(Crypto_Table.crypto_timestamp,DateTime))\
        .filter(Crypto_Table.symbol == userSelectedCrypto2).filter(and_(Crypto_Table.crypto_timestamp >= userSelectedDateTime1),(Crypto_Table.crypto_timestamp <= userSelectedDateTime2)).all()  

    # results1 = session.query(Crypto_Table.symbol, Crypto_Table.price, cast(Crypto_Table.crypto_timestamp,DateTime))\
    # .filter(Crypto_Table.symbol == userSelectedCrypto1).filter(and_(Crypto_Table.crypto_timestamp >= userSelectedDateTime1),(Crypto_Table.crypto_timestamp <= userSelectedDateTime2)).all()

    # results2 = session.query(Crypto_Table.symbol, Crypto_Table.price, cast(Crypto_Table.crypto_timestamp,DateTime))\
    # .filter(Crypto_Table.symbol == userSelectedCrypto2).filter(and_(Crypto_Table.crypto_timestamp >= userSelectedDateTime1),(Crypto_Table.crypto_timestamp <= userSelectedDateTime2)).all()

    test1 = list(np.ravel(results1))
    # test2 = list(np.ravel(results2))

    return json.dumps(test1, default=alchemyencoder) 
    # json.dumps(test2, default=alchemyencoder)



@app.route("/api/v1.0/cryptosies")
def stations():

    conn = engine.connect()
    result = conn.execute("SELECT distinct symbol,price,crypto_timestamp FROM crypto  order by crypto_timestamp desc")
    items = [dict(r) for r in result]
    return(json.dumps({'items': items}, default=alchemyencoder))




if __name__ == "__main__":
    app.run(debug=True)