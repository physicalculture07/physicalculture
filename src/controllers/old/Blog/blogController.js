const blogModel = require('../../models/blogModel');
const blogCategoryModel = require('../../models/blogCategoryModel');
const apiResponse = require('../../helpers/apiResponse');

//s3 bucket
const { s3Uploadv2 } = require('../../service/s3_service');

const addBlog = async (req, res) => {
    const file = req.files;

    if (!file) {
        return res.status(400).send({ message: 'Please upload a file.' });
    }

    try {
        const result = await s3Uploadv2(file);

        const data = req.body;

        console.log(data.Category)
        // return;

        const blogCategoryData = await blogCategoryModel.findOne({ Name: data.Category })

        if (blogCategoryData) {
            data.IsFeatured = "false";
            data.BlogImage = result[0].Location;


            const blogData = new blogModel(data);

            blogData.save(function (err) {
                if (err) {
                    return apiResponse.ErrorResponse(res, err);
                } else {
                    return apiResponse.successResponse(res, "Blog Data Created Sucessfully.");
                }
            });
        } else {
            return apiResponse.notFoundResponse(res, "Blog Category Not Found.");
        }

    } catch (err) {
        console.log(err)
        return apiResponse.ErrorResponse(res, err);
    };
};

const getallBlogHome = async (req, res) => {
    try {
        /*
        await blogModel.find({}).then(async function (data, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (data) {

                const data1 = await blogModel.find({ Category: "User" });
                const data2 = await blogModel.find({ Category: "Seller" });
                const data3 = await blogModel.findOne({ IsFeatured: true })

                const data4 = await blogModel.find({}).limit(4).sort({ createdAt: -1 });

                let obj = [
                    { CategoryName: "User", CategoryData: data1 },
                    { CategoryName: "Seller", CategoryData: data2 }
                ]



                return apiResponse.successResponseWithData(res, "Blog Data Get Sucessfully.", { category: obj, IsFeatured: data3, New: data4 });
            } else {
                console.log(err)
                return apiResponse.notFoundResponse(res, "No Blog Data Found.");
            }
        });*/


        const blogCategory = await blogCategoryModel.find({});

        const featuredData = await blogModel.findOne({ IsFeatured: true });

        const newBlogs = await blogModel.find({ Status: "Active" }).limit(4).sort({ createdAt: -1 });

        let catNames = [];
        blogCategory.forEach(item => {
            catNames.push(item.Name);
        })

        let allcategoryData = [];
        let catLength = catNames.length;

        if (catLength > 0) {
            for (let i = 0; i < catNames.length; i++) {
                let categoryDatas = {};
                let currentCat = catNames[i];
                let currentCategoryData = await getCategoryData(currentCat);
                console.log(currentCategoryData)
                if (currentCategoryData.length != 0) {
                    categoryDatas.CatgegoryName = currentCat;
                    categoryDatas.CategoryId = currentCategoryData[0].CategoryId;
                    categoryDatas.CategoryData = currentCategoryData;
                    allcategoryData.push(categoryDatas);
                }
            }
        }

        async function getCategoryData(catName) {
            let categoryData = await blogModel.find({ Category: catName })
            return categoryData;
        }

        return apiResponse.successResponseWithData(res, "Home Blog Data Get Sucessfully.", { category: allcategoryData, IsFeatured: featuredData, New: newBlogs })

    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};

const getBlogAdmin = async (req, res) => {
    try {
        const { blogId } = req.body;

        await blogModel.findOne({ _id: blogId }).then(function (item, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (item) {
                return apiResponse.successResponseWithData(res, "Blog Data Get Sucessfully.", item);
            } else {
                return apiResponse.notFoundResponse(res, "No Blog Data Found.");
            }
        });

    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};

const deleteBlog = async (req, res) => {
    try {
        const { blogId } = req.body;

        await blogModel.findOneAndRemove({ _id: blogId }).then(function (item, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (item) {
                return apiResponse.successResponse(res, "Blog Data Deleted Sucessfully.");
            };
        });
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};

const updateBlog = async (req, res) => {
    const file = req.files;

    if (!file) {
        return res.status(400).send({ message: 'Please upload a file.' });
    }
    try {

        const result = await s3Uploadv2(file);

        const { blogId, Status, Title, Category, ShortDescription, Description } = req.body;

        await blogModel.findOne({ _id: blogId }).then(function (data, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (data) {

                if (file.length != 0) {
                    data.BlogImage = result[0].Location;
                } else {
                    data.BlogImage = data.BlogImage;
                }

                data.Status = Status;
                data.Title = Title;
                data.Category = Category;
                data.ShortDescription = ShortDescription;
                data.Description = Description;

                data.save();
                return apiResponse.successResponseWithData(res, "Blog Data Updated Sucessfully.", data);
            } else {
                return apiResponse.notFoundResponse(res, "Blog Data Nor Found.");
            }
        })
    } catch (err) {
        console.log(err)
        return apiResponse.ErrorResponse(res, err);
    };
};

const changeStatus = async (req, res) => {
    try {
        const { blogId, Status } = req.body;


        await blogModel.findOne({ _id: blogId }).then(function (item, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (item) {

                item.Status = Status;
                item.save();

                return apiResponse.successResponse(res, "Blog Status Updated Sucessfully.");
            } else {
                return apiResponse.notFoundResponse(res, "Blog Data Not Found.");
            }
        })

    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};

const setFeatured = async (req, res) => {
    try {
        const { blogId, IsFeatured } = req.body;

        await blogModel.findOne({ _id: blogId }).then(function (item, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (item) {
                item.IsFeatured = IsFeatured;
                item.save();

                return apiResponse.successResponseWithData(res, "Blog featured Set sucessfully.", item);
            } else {
                return apiResponse.notFoundResponse(res, err);
            }
        })


    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};

const getIsFeatured = async (req, res) => {
    try {
        await blogModel.find({ IsFeatured: true }).then(function (data, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (data) {
                return apiResponse.successResponseWithData(res, "Featured Blog Data Get Sucessfull.", { "Featured": data });
            } else {
                return apiResponse.notFoundResponse(res, "Featured Blog Data Not Found");
            }
        })
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };

};

const imageLink = async (req, res) => {
    const file = req.files;

    if (!file) {
        return res.status(400).send({ message: 'Please upload a file.' });
    }
    try {
        const result = await s3Uploadv2(file);

        const data = req.body;
        data.BlogImage = result[0].Location;

        return apiResponse.successResponseWithData(res, "Image Link Generated Sucessfully.", data);

    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};

const getBlogsAdmin = async (req, res) => {
    try {
        await blogModel.find({}).then(function (data, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (data) {
                return apiResponse.successResponseWithData(res, "Blog Data Get Sucessfully.", data);
            } else {
                return apiResponse.ErrorResponse(res, err);
            }
        })

    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};

//user
const getBlogById = async (req, res) => {
    try {
        const { blogId } = req.body;

        await blogModel.findOne({ _id: blogId }).then(async function (item, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (item) {
                //blogs
                const newBlogData = await blogModel.find({}).limit(5).sort({ createdAt: -1 });

                //category
                const catData = await blogCategoryModel.find({}).select("Name");

                //relevent-content
                const ReleventData = await blogModel.find({ _id: blogId }).limit(20);

                const relData = {};

                relData.RelevantId = blogId;
                relData.ReleventData = ReleventData;

                return apiResponse.successResponseWithData(res, "Blog Data Get Sucessfully.", { catData: item, NewBlog: newBlogData, categoryNames: catData, ReleventContent: relData });
            }
        })
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};

const seeMore = async (req, res) => {
    try {

        const { categoryId } = req.body;

        await blogModel.find({ CategoryId: categoryId }).then(function (data, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (data) {
                return apiResponse.successResponseWithData(res, "Blog Data Get Sucessfully", data);
            } else {
                return apiResponse.notFoundResponse(res, "Blog Data Not Found.");
            }
        });

    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};


module.exports = { addBlog, getallBlogHome, getBlogAdmin, deleteBlog, updateBlog, changeStatus, setFeatured, getIsFeatured, imageLink, getBlogsAdmin, getBlogById, seeMore };