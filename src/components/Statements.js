import React, { useState, useEffect } from "react"
import axios from "axios"
import Statement from "./Statement"

export default function Statements() {
    const token = localStorage.getItem("token")
    const [statements, setStatements] = useState([])
    const [requestError, setRequestError] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/statements`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setIsLoading(false)

                setStatements([...response.data])
            })
            .catch((error) => {
                setIsLoading(false)
                setRequestError(error)
            })
    }, [])

    function setErrorContainerContent() {
        let errorMessage = ""

        switch (requestError.response?.status) {
            case 0:
                errorMessage = "Erro de conexão. Tente novamente."
                break
            case 500:
                errorMessage = "Algo de errado aconteceu. Tente novamente!"
                break
            default:
                errorMessage = "Não há registros de entrada ou saída"
                break
        }
        return (
            <>
                <p className="statements__empty">{errorMessage}</p>
            </>
        )
    }

    function calcBalance() {
        let balance = statements.reduce((accumulator, { value, type }) => {
            const valueAsNumber = parseFloat(value)
            return type === "deposit"
                ? accumulator + valueAsNumber
                : accumulator - valueAsNumber
        }, 0)

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
                {!isLoading ? (
                    statements?.length > 0 ? (
                        statements.map(
                            (
                                { description, type, value, date, _id },
                                index
                            ) => {
                                return (
                                    <Statement
                                        key={index}
                                        description={description}
                                        type={type}
                                        value={value}
                                        date={date}
                                        _id={_id}
                                    ></Statement>
                                )
                            }
                        )
                    ) : (
                        setErrorContainerContent()
                    )
                ) : (
                    <>
                        <p className="statements__empty">Carregando...</p>
                    </>
                )}
            </ul>

            {setBalanceContainerContent()}
        </article>
    )
}
