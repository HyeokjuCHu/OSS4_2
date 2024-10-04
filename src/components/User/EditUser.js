import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../Common/Loader";
import "./User.css";

const EditUser = () => {
  const [user, setUser] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const getUserApi = "http://localhost:3000/user";

  // getUser 함수를 useCallback으로 정의
  const getUser = useCallback(() => {
    setIsLoading(true); // 로딩 시작
    axios
      .get(`${getUserApi}/${id}`)
      .then((response) => {
        setUser(response.data); // 사용자 데이터 설정
      })
      .catch((err) => {
        setError(err.message); // 오류 처리
      })
      .finally(() => {
        setIsLoading(false); // 로딩 종료
      });
  }, [getUserApi, id]);

  useEffect(() => {
    getUser(); // 컴포넌트가 마운트될 때 사용자 정보 가져오기
  }, [getUser]);

  const handleInput = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUser({ ...user, [name]: value }); // 사용자 정보 업데이트
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true); // 제출 시 로딩 시작

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
        navigate("/show-user"); // 성공적으로 제출 후 리다이렉션
      })
      .catch((error) => {
        setError(error.message); // 오류 처리
      })
      .finally(() => {
        setIsLoading(false); // 로딩 종료
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
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={user.name}
            onChange={handleInput}
          />
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={user.email}
            onChange={handleInput}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            type="text"
            className="form-control"
            id="phone"
            name="phone"
            value={user.phone}
            onChange={handleInput}
          />
        </div>
        <button type="submit" className="btn btn-primary submit-btn">
          EDIT
        </button>
      </form>
    </div>
  );
};

export default EditUser;
