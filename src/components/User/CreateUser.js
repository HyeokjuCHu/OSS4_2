import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateUser = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
        address: { street: "", city: "", state: "", zip: "" }
    });
    const [profilePic, setProfilePic] = useState(null);
    const [error, setError] = useState({});

    const handleInput = (e) => {
        const { name, value } = e.target;
        if (name in user.address) {
            setUser({ ...user, address: { ...user.address, [name]: value } });
        } else {
            setUser({ ...user, [name]: value });
        }
    };

    const handleFileChange = (e) => {
        setProfilePic(e.target.files[0]);
    };

    const validateInputs = () => {
        const errors = {};
        if (!user.name) errors.name = "이름은 필수입니다.";
        if (!user.email) errors.email = "이메일은 필수입니다.";
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user.email)) 
            errors.email = "이메일 형식이 올바르지 않습니다.";
        if (!user.phone || isNaN(user.phone)) 
            errors.phone = "전화번호는 숫자여야 합니다.";
        
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateInputs();
        if (Object.keys(errors).length > 0) {
            setError(errors);
            return;
        }

        const formData = new FormData();
        formData.append("name", user.name);
        formData.append("email", user.email);
        formData.append("phone", user.phone);
        formData.append("role", user.role);
        formData.append("address", JSON.stringify(user.address));
        formData.append("profilePic", profilePic);

        try {
            const response = await fetch("/api/users", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                toast.success("사용자가 성공적으로 생성되었습니다!");
                setUser({ name: "", email: "", phone: "", role: "", address: { street: "", city: "", state: "", zip: "" } });
                setProfilePic(null);
                setError({});
            } else {
                toast.error("사용자 생성에 실패했습니다.");
            }
        } catch (error) {
            toast.error("서버 오류가 발생했습니다.");
        }
    };

    return (
        <div className='user-form'>
            <ToastContainer />
            <h2>사용자 생성</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">이름</label>
                    <input type="text" className="form-control" id="name" name="name" value={user.name} onChange={handleInput} />
                    {error.name && <div className="text-danger">{error.name}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">이메일</label>
                    <input type="text" className="form-control" id="email" name="email" value={user.email} onChange={handleInput} />
                    {error.email && <div className="text-danger">{error.email}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">전화번호</label>
                    <input type="text" className="form-control" id="phone" name="phone" value={user.phone} onChange={handleInput} />
                    {error.phone && <div className="text-danger">{error.phone}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="role" className="form-label">Role</label>
                    <select name="role" value={user.role} onChange={handleInput} className="form-control">
                        <option value="">역할 선택</option>
                        <option value="admin">관리자</option>
                        <option value="editor">편집자</option>
                        <option value="viewer">조회자</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="street" className="form-label">Street</label>
                    <input type="text" className="form-control" id="street" name="street" value={user.address.street} onChange={handleInput} />
                </div>
                <div className="mb-3">
                    <label htmlFor="city" className="form-label">City</label>
                    <input type="text" className="form-control" id="city" name="city" value={user.address.city} onChange={handleInput} />
                </div>
                <div className="mb-3">
                    <label htmlFor="state" className="form-label">State</label>
                    <input type="text" className="form-control" id="state" name="state" value={user.address.state} onChange={handleInput} />
                </div>
                <div className="mb-3">
                    <label htmlFor="zip" className="form-label">ZIP Code</label>
                    <input type="text" className="form-control" id="zip" name="zip" value={user.address.zip} onChange={handleInput} />
                </div>
                <div className="mb-3">
                    <label htmlFor="profilePic" className="form-label">Profile Picture</label>
                    <input type="file" className="form-control" id="profilePic" onChange={handleFileChange} />
                </div>
                <button type="submit" className="btn btn-primary">생성</button>
            </form>
        </div>
    );
};

export default CreateUser;
