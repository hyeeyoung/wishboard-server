const folderController = require("../controllers/folderController");
var router = require("express").Router();

router.get("/:user_id", folderController.selectFolderInfo);
router.get("/list/:user_id", folderController.selectFolderList);
router.get("/item/:user_id/:folder_id", folderController.selectFolderItemInfo);
router.post("/", folderController.insertFolder);
router.put("/", folderController.updateFolder);
router.put("/item/image", folderController.updateFolderImage);
router.delete("/", folderController.deleteFolder);

module.exports = router;
