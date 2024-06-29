import express from "express"
import multer from "multer";
import Cloudinary from "../Cloudinary.js"
import VideoLecture from "../Schema/VideoLectures.js"
import AudioLecture from "../Schema/AudioLecture.js"
import User from "../Schema/User.js";
import lectureCategory from "../Schema/lectureCategory.js";
import BookCategory from "../Schema/BookCategory.js";
import Books from "../Schema/Books.js";
import Admin from "../Schema/Admin.js";
import RegisteredCourse from "../Schema/RegisteredCourse.js";
import Course from "../Schema/Course.js";
import bcrypt from "bcrypt"
import streamifier from "streamifier";
const router = express.Router()

// Multer configuration
const storage = multer.diskStorage({});
const upload = multer({ storage });

// admin 
const createAdmin = async () => {
    const adminEmail = "quranhousesociety@gmail.com";
    const adminPassword = "1234"
    const checkEmail = await Admin.findOne({ email: adminEmail })
    if (checkEmail) {
        return;
    }
    const hashPassword = await bcrypt.hash(adminPassword, 10)
    await Admin.create({
        email: adminEmail,
        password: hashPassword
    })
    console.log("admin created successfully")
}
createAdmin()

router.post("/adminLogin", async (req, res) => {
    try {
        const { email, password } = req.body
        const checkAdmin = await Admin.findOne({ email })
        if (!checkAdmin) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }
        const checkPassword = await bcrypt.compare(password, checkAdmin.password)
        if (!checkPassword) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }
        res.json(checkAdmin)
    } catch (error) {
        console.log(error);
        res.status(500).send("internal server error occured")
    }
})
// user apis
router.post("/userSignUp", async (req, res) => {
    try {
        const { name, email, number, password } = req.body
        const checkEmail = await User.findOne({ email })
        if (checkEmail) {
            return res.status(400).json({ message: "Email already exists" })
        }
        const checkNumber = await User.findOne({ number })
        if (checkNumber) {
            return res.status(400).json({ message: "Number already exists" })
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            name,
            email,
            number,
            password: hashPassword
        })
        res.json(newUser)
    } catch (error) {
        console.log(error);
        return res.status(500).send("internal server error occured")
    }
})
router.post("/userLogIn", async (req, res) => {
    try {
        const { email, password } = req.body
        const checkUser = await User.findOne({ email })
        if (!checkUser) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }
        const checkPassword = await bcrypt.compare(password, checkUser.password)
        if (!checkPassword) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }
        res.json(checkUser)
    } catch (error) {
        console.log(error);
        return res.status(500).send("internal server error occured")
    }
})
// lecture category apis
router.post("/addLectureCat", async (req, res) => {
    try {
        const { category } = req.body;
        const checkCat = await lectureCategory.findOne({ category })
        if (checkCat) {
            return res.status(400).json({ message: "Category with same name already exists" })
        }
        const newCat = await lectureCategory.create({ category })
        res.json(newCat)
    } catch (error) {
        console.log(error);
        return res.status(500).send("internal server error occured")
    }
})
router.get("/getLectureCats", async (req, res) => {
    try {
        const allCats = await lectureCategory.find()
        if (!allCats) {
            return res.status(400).json({ message: "not found any category" })
        }
        res.json(allCats)
    } catch (error) {
        console.log(error);
        return res.status(500).send("internal server error occured")
    }
})
router.get("/getLectureCat/:id", async (req, res) => {
    try {
        const getCatId = await lectureCategory.findById(req.params.id)
        if (!getCatId) {
            return res.status(400).json({ message: "not found any category" })
        }
        res.json(getCatId)
    } catch (error) {
        console.log(error);
        return res.status(500).send("internal server error occured")
    }
})
router.put("/updateLectureCats/:id", async (req, res) => {
    try {
        const { category } = req.body
        const updateCat = await lectureCategory.findByIdAndUpdate(req.params.id, { category }, { new: true })
        if (!updateCat) {
            return res.status(400).json({ message: "not found any category" })
        }
        res.json(updateCat)
    } catch (error) {
        console.log(error);
        return res.status(500).send("internal server error occured")
    }
})
router.delete("/delLectureCats/:id", async (req, res) => {
    try {
        const delCat = await lectureCategory.findByIdAndDelete(req.params.id)
        if (!delCat) {
            return res.status(400).json({ message: "not found any category" })
        }
        res.json({ message: "category deleted successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).send("internal server error occured")
    }
})
// Lectures API
router.post("/addVideoLecture", upload.single("lecImg"), async (req, res) => {
    try {
        const { title, categoryId, powerPointLink, pdfLink, video } = req.body;

        let lectureImage;

        if (req.file) {
            const lectureImageUrl = await Cloudinary.uploader.upload(req.file.path, {
                folder: 'images',
                resource_type: 'image'
            });

            lectureImage = lectureImageUrl.secure_url;
        }
        const newLecture = await VideoLecture.create({
            title,
            video,
            categoryId,
            lecImg: lectureImage,
            powerPointLink,
            pdfLink
        });

        res.json(newLecture);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
});
router.get("/getVideoLectures", async (req, res) => {
    try {
        const allLectures = await VideoLecture.find().populate("categoryId", "category")

        res.json(allLectures);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
});
router.get("/getVideoLectures/:id", async (req, res) => {
    try {
        const idLecture = await VideoLecture.findById(req.params.id).populate("categoryId", "category")
        if (!idLecture) {
            return res.status(400).json({ message: "not found any lecture against this id" })
        }
        res.json(idLecture);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
});
router.get("/getVideoLecture/:title", async (req, res) => {
    try {
        const titleLecture = await VideoLecture.findOne({ title: req.params.title })
        if (!titleLecture) {
            return res.status(400).json({ message: "not found any lecture against this title" })
        }
        res.json(titleLecture);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
});
router.delete("/delVideoLecture/:id", async (req, res) => {
    try {
        const idLecture = await VideoLecture.findByIdAndDelete(req.params.id)
        if (!idLecture) {
            return res.status(400).json({ message: "not found any lecture against this id" })
        }
        res.json({ message: "lecture deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
});
router.put("/updateVideoLec/:id", async (req, res) => {
    try {
        const { title, categoryId, powerPointLink, pdfLink, video } = req.body
        let updateVideoLec = {}
        if (title) {
            updateVideoLec.title = title
        }
        if (categoryId) {
            updateVideoLec.categoryId = categoryId
        }
        if (powerPointLink) {
            updateVideoLec.powerPointLink = powerPointLink
        }
        if (pdfLink) {
            updateVideoLec.pdfLink = pdfLink
        }
        if (video) {
            updateVideoLec.video = video
        }
        const updatedVideoLec = await VideoLecture.findByIdAndUpdate(req.params.id, updateVideoLec, { new: true })
        if (!updatedVideoLec) {
            return res.status(400).json({ message: "lecture not found against this id" })
        }
        res.json(updatedVideoLec)
    } catch (error) {
        console.log(error);
        return res.status(500).send("internal server error occured")
    }
})

router.post("/addAudioLecture", upload.single("lecImg"), async (req, res) => {
    try {
        const { title, categoryId, powerPointLink, pdfLink, audio } = req.body;

        let lectureImage;

        if (req.file) {
            const lectureImageUrl = await Cloudinary.uploader.upload(req.file.path, {
                folder: 'images',
                resource_type: 'image'
            });

            lectureImage = lectureImageUrl.secure_url;
        }
        const newLecture = await AudioLecture.create({
            title,
            audio,
            categoryId,
            lecImg: lectureImage,
            powerPointLink,
            pdfLink
        });

        res.json(newLecture);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
});

router.get("/getAudioLectures", async (req, res) => {
    try {
        const allLectures = await AudioLecture.find().populate("categoryId", "category")

        res.json(allLectures);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
});

router.get("/getAudioLectures/:id", async (req, res) => {
    try {
        const idLecture = await AudioLecture.findById(req.params.id).populate("categoryId", "category")
        if (!idLecture) {
            return res.status(400).json({ message: "not found any lecture against this id" })
        }
        res.json(idLecture);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
});

router.get("/getAudioLecture/:title", async (req, res) => {
    try {
        const titleLecture = await AudioLecture.findOne({ title: req.params.title })
        if (!titleLecture) {
            return res.status(400).json({ message: "not found any lecture against this title" })
        }
        res.json(titleLecture);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
});
router.put("/updateAudioLec/:id", async (req, res) => {
    try {
        const { title, categoryId, powerPointLink, pdfLink, audio } = req.body
        let updateAudioLec = {}
        if (title) {
            updateAudioLec.title = title
        }
        if (categoryId) {
            updateAudioLec.categoryId = categoryId
        }
        if (powerPointLink) {
            updateAudioLec.powerPointLink = powerPointLink
        }
        if (pdfLink) {
            updateAudioLec.pdfLink = pdfLink
        }
        if (audio) {
            updateAudioLec.audio = audio
        }
        const updatedAudioLec = await AudioLecture.findByIdAndUpdate(req.params.id, updateAudioLec, { new: true })
        if (!updatedAudioLec) {
            return res.status(400).json({ message: "lecture not found against this id" })
        }
        res.json(updatedAudioLec)
    } catch (error) {
        console.log(error);
        return res.status(500).send("internal server error occured")
    }
})
router.delete("/delAudioLecture/:id", async (req, res) => {
    try {
        const idLecture = await AudioLecture.findByIdAndDelete(req.params.id)
        if (!idLecture) {
            return res.status(400).json({ message: "not found any lecture against this id" })
        }
        res.json({ message: "lecture deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
});

// course apis
router.post("/addCourse", async (req, res) => {
    try {
        const { title, description } = req.body
        const newCourse = await Course.create({
            title,
            description
        })
        res.json(newCourse)
    } catch (error) {
        console.log(error);
        return res.status(500).send("internal server error occured")
    }
})
router.get("/allCourses", async (req, res) => {
    try {
        const allCourses = await Course.find()
        if (!allCourses) {
            return res.status(400).json({ message: "Not found any course" })
        }
        res.json(allCourses)
    } catch (error) {
        console.log(error);
        return res.status(500).send("internal server error occured")
    }
})
router.get("/getCourse/:id", async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        if (!course) {
            return res.status(400).json({ message: "not found any course against this id" })
        }
        res.json(course)
    } catch (error) {
        console.log(error);
        return res.status(500).send("internal server error")
    }
})
router.put("/updateCourse/:id", async (req, res) => {
    try {
        const { title, description } = req.body
        let updateCourse = {}
        if (title) {
            updateCourse.title = title
        }
        if (description) {
            updateCourse.description = description
        }

        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, updateCourse, { new: true })
        if (!updatedCourse) {
            return res.status(400).json({ message: "not found any course against this id" })
        }
        res.json(updatedCourse)
    } catch (error) {
        console.log(error);
        return res.status(500).send("internal server error")
    }
})
router.get("/delCourse/:id", async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id)
        if (!course) {
            return res.status(400).json({ message: "not found any course against this id" })
        }
        res.json(course)
    } catch (error) {
        console.log(error);
        return res.status(500).send("internal server error")
    }
})
// course registration apis
router.post("/courseRegis", async (req, res) => {
    try {
        const { userId, courseId, message } = req.body
        const newRegisCourse = await RegisteredCourse.create({
            userId,
            courseId,
            message,
            status: "Pending"
        })
        res.json(newRegisCourse)
    } catch (error) {
        console.log(error);
        return res.status(500).send("internal server error occured")
    }
})
router.get("/getcourseRegis", async (req, res) => {
    try {
        const courses = await RegisteredCourse.find().populate("userId", "name email").populate("courseId", "title description")
        res.json(courses)
    } catch (error) {
        console.log(error);
        return res.status(500).send("internal server error occured")
    }
})
router.delete("/delCourseRegis/:id", async (req, res) => {
    try {
        const checkRequest = await RegisteredCourse.findByIdAndDelete(req.params.id)
        if (!checkRequest) {
            return res.status(400).json({ message: "Request not found" })
        }
        res.json({ message: "request deleted successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).send("internal server error occured")
    }
})
router.put("/acceptedRequest/:id", async (req, res) => {
    try {
        const checkRequest = await RegisteredCourse.findById(req.params.id)
        if (!checkRequest) {
            return res.status(400).json({ message: "Request not found" })
        }
        const UpdateReqStatus = await RegisteredCourse.findByIdAndUpdate(req.params.id, { status: "Accepted" }, { new: true })
        res.json(UpdateReqStatus)
    } catch (error) {
        console.log(error);
        return res.status(500).send("internal server error occured")
    }
})
router.put("/rejectedRequest/:id", async (req, res) => {
    try {
        const checkRequest = await RegisteredCourse.findById(req.params.id)
        if (!checkRequest) {
            return res.status(400).json({ message: "Request not found" })
        }
        const UpdateReqStatus = await RegisteredCourse.findByIdAndUpdate(req.params.id, { status: "Rejected" }, { new: true })
        res.json(UpdateReqStatus)
    } catch (error) {
        console.log(error);
        return res.status(500).send("internal server error occured")
    }
})
// book apis
router.post("/uploadBook", upload.single("bookImg"), async (req, res) => {
    try {
        const { title, categoryId, pdfBookLink } = req.body;

        let bookImage;

        if (req.file) {
            const bookImageUrl = await Cloudinary.uploader.upload(req.file.path, {
                folder: 'images',
                resource_type: 'image'
            });

            bookImage = bookImageUrl.secure_url;
        }

        const newBook = await Books.create({
            title,
            categoryId,
            bookImg: bookImage,
            pdfBookLink
        });

        res.json(newBook);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
});
router.get("/allBooks", async (req, res) => {
    try {
        const allBooks = await Books.find().populate("categoryId", "category")
        if (!allBooks) {
            return res.status(400).json({ message: "not found any book" })
        }
        res.json(allBooks)
    } catch (error) {
        console.log(error);
        res.status(500).send("internal servre error occured")
    }

})
router.get("/getBook/:id", async (req, res) => {
    try {
        const idBook = await Books.findById(req.params.id).populate("categoryId", "category")
        if (!idBook) {
            return res.status(400).json({ message: "Book not found" })
        }
        res.json(idBook)
    } catch (error) {
        console.log(error);
        res.status(500).send("internal servre error occured")
    }

})
router.get("/book/:title", async (req, res) => {
    try {
        const bookCategory = await Books.findOne({ title: req.params.title }).populate("categoryId", "category")
        if (!bookCategory) {
            return res.status(400).json({ message: "Book not found" })
        }
        res.json(bookCategory)
    } catch (error) {
        console.log(error);
        res.status(500).send("internal servre error occured")
    }
})
router.put("/updateBook/:id", async (req, res) => {
    try {
        const { title, categoryId, pdfBookLink } = req.body;
        const newBook = {}
        if (title) {
            newBook.title = title
        }
        if (categoryId) {
            newBook.categoryId = categoryId
        }
        if (pdfBookLink) {
            newBook.pdfBookLink = pdfBookLink
        }
        const updateBook = await Books.findByIdAndUpdate(req.params.id, newBook, { new: true })
        if (!updateBook) {
            return res.status(400).json({ message: "book not found" })
        }
        res.json(updateBook)
    } catch (error) {
        console.log(error);
        res.status(500).send("internal server error occured")
    }
})
router.delete("/delBook/:id", async (req, res) => {
    try {
        const delBook = await Books.findByIdAndDelete(req.params.id)
        if (!delBook) {
            return res.status(400).json({ message: "Book not found" })
        }
        res.json({ message: "book deleted successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).send("internal servre error occured")
    }

})
// book category apis
router.post("/addBookCat", async (req, res) => {
    try {
        const { category } = req.body;
        const checkCat = await BookCategory.findOne({ category })
        if (checkCat) {
            return res.status(400).json({ message: "Category with same name already exists" })
        }
        const newCat = await BookCategory.create({ category })
        res.json(newCat)
    } catch (error) {
        console.log(error);
        return res.status(500).send("internal server error occured")
    }
})
router.get("/getBookCats", async (req, res) => {
    try {
        const allCats = await BookCategory.find()
        if (!allCats) {
            return res.status(400).json({ message: "not found any category" })
        }
        res.json(allCats)
    } catch (error) {
        console.log(error);
        return res.status(500).send("internal server error occured")
    }
})
router.get("/getBookCat/:id", async (req, res) => {
    try {
        const getCatId = await BookCategory.findById(req.params.id)
        if (!getCatId) {
            return res.status(400).json({ message: "not found any category" })
        }
        res.json(getCatId)
    } catch (error) {
        console.log(error);
        return res.status(500).send("internal server error occured")
    }
})
router.put("/updateBookCats/:id", async (req, res) => {
    try {
        const { category } = req.body
        const updateCat = await BookCategory.findByIdAndUpdate(req.params.id, { category }, { new: true })
        if (!updateCat) {
            return res.status(400).json({ message: "not found any category" })
        }
        res.json(updateCat)
    } catch (error) {
        console.log(error);
        return res.status(500).send("internal server error occured")
    }
})
router.delete("/delBookCats/:id", async (req, res) => {
    try {
        const delCat = await BookCategory.findByIdAndDelete(req.params.id)
        if (!delCat) {
            return res.status(400).json({ message: "not found any category" })
        }
        res.json({ message: "category deleted successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).send("internal server error occured")
    }
})
export default router;