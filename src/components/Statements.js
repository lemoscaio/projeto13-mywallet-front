import React, { useState, useEffect } from "react"
import axios from "axios"

// const API_URL = "https://caio-lemos-my-wallet.herokuapp.com"
const API_URL = "http://192.168.1.178:5000"

export default function Statements() {
    const token = localStorage.getItem("token")
    const [statements, setStatements] = useState([])

    useEffect(() => {
        axios
            .get(`${API_URL}/statements`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setStatements([...response.data])
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    function calcBalance() {
        let balance = statements.reduce((accumulator, { value, type }) => {
            const valueAsNumber = parseFloat(value)
            return type === "deposit"
                ? accumulator + valueAsNumber
                : accumulator - valueAsNumber
        }, 0)

        // console.log(balance)
        const balanceAsNumber = parseFloat(balance).toFixed(2)

        return balanceAsNumber
    }

    function setBalanceContainerContent() {
        return statements.length > 0 ? (
            <div className="statements__balance-container">
                <p className="statements__balance-label">Saldo</p>
                <p
                    className={`statements__balance-value ${
                        calcBalance() > 0
                            ? "positive-number"
                            : "negative-number"
                    }`}
                >
                    {calcBalance()}
                </p>
            </div>
        ) : (
            <></>
        )
    }

    return (
        <article className="main-screen__statements statements">
            <ul className="statements__list">
                {statements?.length > 0 ? (
                    statements.map(({ description, type, value }) => {
                        return (
                            <li className="statements__item">
                                <h1 className="statements__date">10/04</h1>
                                <h1 className="statements__description">
                                    {description}
                                </h1>
                                <h1
                                    className={`statements__value ${
                                        type === "deposit"
                                            ? "positive-number"
                                            : "negative-number"
                                    }`}
                                >
                                    {value}
                                </h1>
                            </li>
                        )
                    })
                ) : (
                    <p className="statements__empty">
                        Não há registros de entrada ou saída
                    </p>
                )}
            </ul>

            {setBalanceContainerContent()}
        </article>
    )
}