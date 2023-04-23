<template>
  <el-card header="文件">
    <div>
      <div style="display: flex; flex-wrap: nowrap;">
      <img style="max-width: 300px;max-height: 200px" src="../../static/文件默认封面_2.gif" alt="文件" />
      </div>
      <div style="display: block; flex-wrap: nowrap;">
        <el-text><span>{{ formatFileSize(fileSize) }}</span></el-text>
      </div>
      <div style="display: block; flex-wrap: nowrap;">
        <el-text><span>{{ fileName }}</span></el-text>
      </div>
      <el-button type="primary" size="small" @click="downloadFile">下载</el-button>
    </div>
  </el-card>
</template>

<script>
import { defineComponent } from 'vue';
import { ElCard, ElButton } from "element-plus";
import axios from "axios";

export default defineComponent({
  name: "downloadFile",
  components: { ElCard, ElButton },
  props: {
    fileUrl: String,
    fileName: String,
    fileSize: String,
    isLargeFile: Boolean,
  },
  methods: {
    formatFileSize(size) {
      console.log(`格式化文件${this.fileName}大小`);
      if (size === "unknown") return size;
      if (size === 0) return "0 Bytes";
      const units = ["Bytes", "KB", "MB", "GB", "TB"];
      const i = Math.floor(Math.log(size) / Math.log(1024));
      return `${(size / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
    },
    async downloadFile() {
      console.log(`下载文件${this.fileName}`);
      console.log("文件url", this.fileUrl);
      const link = document.createElement("a");
      // if (this.isLargeFile) {
      //   let res=await axios.get(this.fileUrl);
      // }
      link.href = this.fileUrl;
      link.download = this.fileName;
      link.click();
    },
  },
});
</script>

<style>
.file-name {
  font-weight: bold;
}
.file-type {
  color: #999;
  margin-inline-start: 5px;
  margin-inline-end: 5px;
}
.file-size {
  color: #999;
  margin-inline-start: 5px;
}
</style>
