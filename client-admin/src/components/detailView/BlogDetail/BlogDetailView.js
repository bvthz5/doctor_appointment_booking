import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Modal } from "@mui/material"; // Import Material-UI components
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import toastr from "toastr";
import Swal from "sweetalert2";

import toastrOptions from "../../../utils/toastConfig";
import styles from "./BlogDetails.module.css";
import { blogView, deleteBlog } from "../../../service/blogService";
import UpdateBlog from "../../forms/blogForm/UpdateBlog";


const BlogDetailView = () => {
  const { id } = useParams();

  const [blogDetails, setBlogDetails] = useState({});
  const [isModalOpen, setIsModalOpen] = React.useState("");
  const [selectedRowData, setSelectedRowData] = React.useState("");

  const handleDeleteClick = async (id, name) => {
    Swal.fire({
      title: `Delete ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Delete!`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        deleteBlog(id)
          .then((response) => {
            if (response.status === 200) {
              toastr.success(
                "Blog deleted successfully!",
                "Success",
                toastrOptions
              );
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  const openModal = (rowData) => {
    setSelectedRowData(rowData);
    setIsModalOpen(true);
  };

  const handleAddBlogSuccess = () => {
    setIsModalOpen(false);
  };

  const getBlogById = async () => {
    try {
      const response = await blogView(id);
      if (response.status === 200) {
        setBlogDetails(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getBlogById();
  }, [id]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Card className={styles.card}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <EditIcon
              style={{ color: "orange" }}
              onClick={() => openModal(blogDetails)} // Pass the row data here
            />{" "}
            <DeleteIcon
              style={{ color: "red" }}
              onClick={() => handleDeleteClick(blogDetails?.id, blogDetails?.title)}
            />
          </div>
          <h2>{blogDetails?.title}</h2>
          <p style={{ marginBottom: "-10px" }}>
            Last updatedOn : {new Date(blogDetails?.updatedAt).toLocaleDateString()}
          </p>
          <p>Author : {blogDetails?.doctor?.name}</p>
          <p>{blogDetails?.content}</p>
        </Card>
      </div>
      <Modal open={isModalOpen}>
        <UpdateBlog data={selectedRowData} onSuccess={handleAddBlogSuccess} />
      </Modal>
    </div>
  );
};

export default BlogDetailView;
