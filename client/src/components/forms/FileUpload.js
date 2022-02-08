import axios from "axios";
import React from "react";
import Resizer from "react-image-file-resizer";
import { useSelector } from "react-redux";
import { Avatar, Badge } from "antd";

const FileUpload = (props) => {
    const { values, setValues, setLoading } = props;
    const { user } = useSelector((state) => ({ ...state }));

    const fileUpoadAndReset = (e) => {
        // console.log(e.target.files);

        // resize
        let imageFiles = e.target.files;
        let allUploadedFiles = values.images;

        if (imageFiles) {
            setLoading(true);

            for (let i = 0; i < imageFiles.length; i++) {
                Resizer.imageFileResizer(
                    imageFiles[i],
                    720,
                    720,
                    "JPEG",
                    100,
                    0,
                    (uri) => {
                        console.log("URI = ", uri);
                        axios
                            .post(
                                `${process.env.REACT_APP_API}/uploadimages`,
                                { image: uri },
                                {
                                    headers: {
                                        authtoken: user ? user.token : "",
                                    },
                                }
                            )
                            .then((res) => {
                                console.log("Image Uploaded ", res);
                                setLoading(false);
                                allUploadedFiles.push(res.data);

                                setValues({ ...values, images: allUploadedFiles });
                            })
                            .catch((err) => {
                                setLoading(false);
                                console.log("uploadimages", err);
                            });
                    },
                    "base64"
                );
            }
        }
        // send back to server to upload to cloudinary
        // set url to images[] in the parent component  = CreateProduct
    };

    const handleImageRemove = (public_id) => {
        setLoading(true);
        console.log("Image Removed", public_id);
        axios
            .post(
                `${process.env.REACT_APP_API}/removeimage`,
                { public_id },
                {
                    headers: {
                        authtoken: user ? user.token : "",
                    },
                }
            )
            .then((res) => {
                setLoading(false);
                const { images } = values;
                console.log('image removing response', res);
                let filteredImages = images.filter((item) => {
                    return item.public_id !== public_id;
                });
                console.log('Left Images After Removed at handleImageRemove', filteredImages);
                setValues({ ...values, images: filteredImages });
            })
            .catch((err) => {
                setLoading(false);
                console.log("Image Removed Failed at handleImageRemove ", err);
            });
    };

    return (
        <>
            <div className="row">
                {values.images &&
                    values.images.map((image) => (
                        <Badge
                            count="x"
                            key={image.public_id}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleImageRemove(image.public_id)}
                        >
                            <Avatar
                                src={image.uril}
                                size={100}
                                shape="square"
                                className="ml-3"
                            />
                        </Badge>
                    ))}
            </div>

            <div className="row">
                <label className="btn btn-primary btn-raised mt-3">
                    Choose File
                    <input
                        type="file"
                        multiple
                        hidden
                        accept="images/*"
                        onChange={fileUpoadAndReset}
                    />
                </label>
            </div>
        </>
    );
};

export default FileUpload;
