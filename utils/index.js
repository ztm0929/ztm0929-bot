const tencentcloud = require("tencentcloud-sdk-nodejs-lighthouse");

const LighthouseClient = tencentcloud.lighthouse.v20200324.Client;

const clientConfig = {
  credential: {
    secretId: process.env.TENCENTCLOUD_SECRET_ID,
    secretKey: process.env.TENCENTCLOUD_SECRET_KEY,
  },
  region: "ap-guangzhou",
  profile: {
    httpProfile: {
      endpoint: "lighthouse.tencentcloudapi.com",
    },
  },
};

const client = new LighthouseClient(clientConfig);
const params = {};
client.DescribeSnapshots(params).then(
  (data) => {
    console.log(data);
    
    // 找到最早的快照
    if (data.SnapshotSet && data.SnapshotSet.length > 0) {
      // 按创建时间排序，找到最早的快照
      const oldestSnapshot = data.SnapshotSet.reduce((oldest, current) => {
        return new Date(oldest.CreatedTime) < new Date(current.CreatedTime) ? oldest : current;
      });
      
      console.log("最早的快照:", oldestSnapshot.SnapshotId, oldestSnapshot.CreatedTime);
      
      // 删除最早的快照
      const deleteParams = {
        "SnapshotIds": [
          oldestSnapshot.SnapshotId
        ]
      };
      
      client.DeleteSnapshots(deleteParams).then(
        (deleteData) => {
          console.log("删除成功:", deleteData);
        },
        (deleteErr) => {
          console.error("删除失败:", deleteErr);
        }
      );
    }
  },
  (err) => {
    console.error("error", err);
  }
);