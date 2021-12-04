const folderController = require("../controllers/folderController");
const { verifyToken } = require("../middleware/auth");
var router = require("express").Router();

router.get("/", verifyToken, folderController.selectFolderInfo);
router.get("/list", verifyToken, folderController.selectFolderList);
router.get(
  "/item/:folder_id",
  verifyToken,
  folderController.selectFolderItemInfo
);
router.post("/", verifyToken, folderController.insertFolder);
router.put("/", verifyToken, folderController.updateFolder);
router.put("/item/image", folderController.updateFolderImage);
router.delete("/", folderController.deleteFolder);

module.exports = router;
