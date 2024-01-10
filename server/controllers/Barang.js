import Barang from "../models/Barang.js";
import path from "path";
import fs from "fs";

export const getBarangs = async (req, res) => {
  try {
    const response = await Barang.findAll();
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getBarangById = async (req, res) => {
  try {
    const response = await Barang.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const saveBarang = (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "No File Uploaded" });
  const name = req.body.title;
  const code = req.body.code;
  const location = req.body.location;
  const datein = req.body.datein;
  const dateout = req.body.dateout;
  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "Invalid Images" });
  if (fileSize > 5000000)
    return res.status(422).json({ msg: "Image must be less than 5 MB" });

  file.mv(`./public/images/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await Barang.create({
        name: name,
        code: code,
        location: location,
        datein: datein,
        dateout: dateout,
        image: fileName,
        url: url,
      });
      res.status(201).json({ msg: "Product Created Successfuly" });
    } catch (error) {
      console.log(error.message);
    }
  });
};

export const updateBarang = async (req, res) => {
  const barang = await Barang.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!barang) return res.status(404).json({ msg: "No Data Found" });

  let fileName = "";
  if (req.files === null) {
    fileName = barang.image;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 5000000)
      return res.status(422).json({ msg: "Image must be less than 5 MB" });

    const filepath = `./public/images/${barang.image}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
  const name = req.body.title;
  const code = req.body.code;
  const location = req.body.location;
  const datein = req.body.datein;
  const dateout = req.body.dateout;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

  try {
    await Barang.update(
      {
        name: name,
        code: code,
        location: location,
        datein: datein,
        dateout: dateout,
        image: fileName,
        url: url,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "Product Updated Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteBarang = async (req, res) => {
  const barang = await Barang.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!barang) return res.status(404).json({ msg: "No Data Found" });

  try {
    const filepath = `./public/images/${barang.image}`;
    fs.unlinkSync(filepath);
    await Barang.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Product Deleted Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};
