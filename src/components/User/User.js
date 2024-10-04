import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./User.css";

const EditUser = () => {
  const [user, setUser] = useState(null); // 초기값을 null로 변경
  const { id } = useParams();
  const getUserApi = "http://localhost:3000/user";

  // useCallback을 사용하여 getUser 정의
  const getUser = useCallback(() => {
    axios
      .get(`${getUserApi}/${id}`) // template literals로 간소화
      .then((response) => {
        setUser(response.data); // item.data를 response.data로 변경
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]); // id를 종속성으로 추가

  useEffect(() => {
    getUser(); // useEffect 안에서 getUser 호출
  }, [getUser]); // getUser를 종속성으로 추가

  // user가 null일 때를 처리
  if (!user) {
    return <div>Loading...</div>; // 데이터 로딩 중 메시지
  }

  return (
    <div className="user mt-5">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Firstname</th>
            <th>Lastname</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Name</td>
            <td>{user.name}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{user.email}</td>
          </tr>
          <tr>
            <td>Phone</td>
            <td>{user.phone}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EditUser;
