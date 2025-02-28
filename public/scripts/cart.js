import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

function Cart({ username, sessionId }) {
    const [cartItems, setCartItems] = useState([]);
    const [totalCost, setTotalCost] = useState(0);

    useEffect(() => {
        async function fetchCart() {
            const response = await fetch(`/cart?username=${username}&sessionId=${sessionId}`);
            if (response.ok) {
                const data = await response.json();
                setCartItems(data.cartItems);
                setTotalCost(data.totalCost);
            } else {
                console.error("Failed to fetch cart.");
            }
        }

        fetchCart();
    }, [username, sessionId]);

    async function removeItem(itemId) {
        const response = await fetch(`/cart`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, sessionId, itemId }),
        });

        if (response.ok) {
            const data = await response.json();
            setCartItems(cartItems.filter(item => item.itemId !== itemId));
            setTotalCost(data.totalCost);
        } else {
            console.error("Failed to remove item.");
        }
    }

    return (
        <div>
            <h1>Shopping Cart</h1>
            <table>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Title</th>
                        <th>Cost</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map(item => (
                        <tr key={item.itemId}>
                            <td>{item.type}</td>
                            <td>{item.title}</td>
                            <td>${item.cost}</td>
                            <td>
                                <button onClick={() => removeItem(item.itemId)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h3>Total Cost: ${totalCost}</h3>
        </div>
    );
}

const params = new URLSearchParams(window.location.search);
const username = params.get("username");
const sessionId = params.get("sessionId");

ReactDOM.render(<Cart username={username} sessionId={sessionId} />, document.getElementById("cart-container"));
