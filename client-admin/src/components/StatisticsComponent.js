import axios from "axios";
import React, { useContext, useRef, useEffect, useState } from "react";
import MyContext from "../contexts/MyContext";
import "../Css/Statistics.css";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function Statistics() {
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const statisticsRef = useRef(null);
    const [state, setState] = useState({
        noCategories: 0,
        noProducts: 0,
        noOrders: 0,
        noOrdersPending: 0,
        noOrdersApproved: 0,
        noOrdersCanceled: 0,
        noOrdersRevenue: 0,
        noCustomers: 0
    });

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    const apiGetStatistics = () => {
        const config = { headers: { "x-access-token": context.token } };
        axios
            .get("/api/admin/statistics", config)
            .then((res) => {
                const result = res.data;
                setState({
                    noCategories: result.noCategories,
                    noProducts: result.noProducts,
                    noOrders: result.noOrders,
                    noOrdersPending: result.noOrdersPending,
                    noOrdersApproved: result.noOrdersApproved,
                    noOrdersCanceled: result.noOrdersCanceled,
                    noOrdersRevenue: result.noOrdersRevenue || 0,
                    noCustomers: result.noCustomers
                });
            })
            .catch((error) => {
                console.error("Error fetching statistics:", error);
            });
    };

    const exportToPDF = () => {
        if (window.confirm("Are you sure you want to export to PDF?")) {
            const input = statisticsRef.current;
            html2canvas(input).then((canvas) => {
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF();
                pdf.addImage(imgData, "PNG", 10, 10);
                pdf.save("statistics.pdf");
            });
        }
    };

    useEffect(() => {
        apiGetStatistics();
    }, []);

    return (
        <div className="statistics-container" ref={statisticsRef}>
            <table className="statistics-table">
                <thead>
                    <tr>
                        <th>DANH MỤC</th>
                        <th>SỐ LƯỢNG</th>
                        <th>GHI CHÚ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="statistics-section-heading">
                    <div class="statistics-section-heading">Quản lý Bán Hàng</div>
                    </tr>
                    <tr>
                        <td>📂 Loại sản phẩm</td>
                        <td>{state.noCategories}</td>
                        <td>
                            <button className="detail-button" onClick={() => handleNavigate("/admin/category")}>
                                <FontAwesomeIcon icon={faEye} /> Xem chi tiết
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>📦 Số sản phẩm</td>
                        <td>{state.noProducts}</td>
                        <td>
                            <button className="detail-button" onClick={() => handleNavigate("/admin/product")}>
                                <FontAwesomeIcon icon={faEye} /> Xem chi tiết
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>🛒 Số đơn hàng</td>
                        <td>{state.noOrders}</td>
                        <td>
                            <button className="detail-button" onClick={() => handleNavigate("/admin/order")}>
                                <FontAwesomeIcon icon={faEye} /> Xem chi tiết
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>👥 Khách hàng</td>
                        <td>{state.noCustomers}</td>
                        <td>
                            <button className="detail-button" onClick={() => handleNavigate("/admin/customer")}>
                                <FontAwesomeIcon icon={faEye} /> Xem chi tiết
                            </button>
                        </td>
                    </tr>
                    <tr className="statistics-section-heading">
                    <div class="statistics-section-heading">Quản Lí Tài Khoản</div>
                    </tr>
                    <tr>
                        <td>⏳ Đang chờ xử lý</td>
                        <td>{state.noOrdersPending}</td>
                        <td>
                            <button className="detail-button" onClick={() => handleNavigate("/admin/order")}>
                                <FontAwesomeIcon icon={faEye} /> Xem chi tiết
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>✅ Đã phê duyệt</td>
                        <td>{state.noOrdersApproved}</td>
                        <td>
                            <button className="detail-button" onClick={() => handleNavigate("/admin/order")}>
                                <FontAwesomeIcon icon={faEye} /> Xem chi tiết
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>❌ Đã hủy</td>
                        <td>{state.noOrdersCanceled}</td>
                        <td>
                            <button className="detail-button" onClick={() => handleNavigate("/admin/order")}>
                                <FontAwesomeIcon icon={faEye} /> Xem chi tiết
                            </button>
                        </td>
                    </tr>
                    <tr className="statistics-section-heading">
                    <div class="statistics-section-heading">Quản Lí Doanh Thu</div>
                    </tr>
                    <tr>
                        <td>💵 Tổng doanh thu</td>
                        <td>{formatPrice(state.noOrdersRevenue)}</td>
                        <td>
                            <button className="detail-button" onClick={() => handleNavigate("/admin/order")}>
                                <FontAwesomeIcon icon={faEye} /> Xem chi tiết
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button className="export-button" onClick={exportToPDF}>Export to PDF</button>
        </div>
    );
    
}

export default Statistics;
