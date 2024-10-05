import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../Common/Loader";
import "./User.css";

const EditUser = () => {
    const [user, setUser] = useState({ name: "", email: "", phone: "", role: "", address: "" }); // role 및 address 추가
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const getUserApi = "http://localhost:3000/user";

    const getUser = useCallback(() => {
        setIsLoading(true);
        axios
            .get(`${getUserApi}/${id}`)
            .then((response) => {
                setUser(response.data);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [getUserApi, id]);

    useEffect(() => {
        getUser();
    }, [getUser]);

    const handleInput = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        fetch(`${getUserApi}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(() => {
                navigate("/show-user");
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="user-form">
            <div className="heading">
                {isLoading && <Loader />}
                {error && <p>Error: {error}</p>}
                <p>Edit Form</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name="name" value={user.name} onChange={handleInput} />
                </div>
                <div className="mb-3 mt-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={user.email} onChange={handleInput} />
                </div>
                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input type="text" className="form-control" id="phone" name="phone" value={user.phone} onChange={handleInput} />
                </div>
                <div className="mb-3">
                    <label htmlFor="role" className="form-label">Role</label>
                    <input type="text" className="form-control" id="role" name="role" value={user.role} onChange={handleInput} />
                </div>
                <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input type="text" className="form-control" id="address" name="address" value={user.address} onChange={handleInput} />
                </div>
                <button type="submit" className="btn btn-primary submit-btn">EDIT</button>
            </form>
        </div>
    );
};

export default EditUser;
