<template>
  <div>
    <div>
      <el-table :data="tableData" style="width: 64%;margin-bottom: 20px;margin-left: 20%;"
        :span-method="arraySpanMethod" max-height="800px" row-key="id" border>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table class="table-in-table" :data="props.row.datas" style="width: 100%;margin-left: 20px;" row-key="id"
              :span-method="arraySpanMethod" border>
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-table class="table-in-table" :data="props.row.datas" style="width: 100%;margin-left: 20px;"
                    row-key="id" :span-method="arraySpanMethod" border>
                    <el-table-column type="expand">
                      <template slot-scope="props">
                        <el-table class="table-in-table" :data="props.row.datas" style="width: 100%;margin-left: 66px;"
                          row-key="id" border>
                          <el-table-column prop="name" label="方法名" width="520"></el-table-column>
                          <el-table-column prop="mth_id" label="方法id" width="249" align="center"></el-table-column>
                          <el-table-column label="操作" width="160" align="center">
                            <template slot-scope="props">
                              <el-button v-wave type="primary" size="small" align="center"
                                @click="Funcin(props)">查看具体分析</el-button>
                            </template>
                          </el-table-column>
                        </el-table>
                      </template>
                    </el-table-column>

                    <el-table-column prop="name" label="类名" width="400"></el-table-column>
                    <el-table-column prop="out_class_id" label="从属的外部类id" width="240" align="center"></el-table-column>
                    <el-table-column prop="cid" label="类id" width="149" align="center"></el-table-column>
                    <el-table-column label="操作" width="160" align="center">
                      <template slot-scope="props">
                        <el-button v-wave type="primary" size="small" align="center"
                          @click="Classin(props)">查看具体分析</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>

              <el-table-column prop="name" label="文件名" width="560"></el-table-column>
              <el-table-column prop="fid" label="文件id" width="249" align="center"></el-table-column>
              <el-table-column label="操作" width="160" align="center">
                <template slot-scope="props">
                  <el-button v-wave type="primary" size="small" align="center" @click="Filein(props)">查看具体分析</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="版本日期" width="580"></el-table-column>
        <el-table-column prop="ver_id" label="版本id" width="209" align="center"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="props">
            <el-button v-wave type="primary" size="small" @click="Projectin(props)">查看具体分析</el-button>
            <el-button v-wave type="primary" size="small" style='margin-top: 5px;'
              @click="Report(props)">查看报告</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div id="myChart" center="true" style="width: 800px; background-color:#ffffff;height: 450px;margin-left: 25%;">
      </div>

      <el-button v-wave class="Back" type="primary" @click="back">返回</el-button>
      <!--el-button class="Look" type="primary" @click="Look"--><!----查看历史版本/-el-button-->
      <el-button v-wave class="LoginOut" type="warning" @click="loginOut">登出</el-button>

    </div>


  </div>

</template>

<script>
import Vue, { ref } from "vue";
import * as echarts from "echarts";
let lineDefaultOpt = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    bottom: 0,
    left: 'center'
  },
  grid: {
    left: 30,
    bottom: 50,
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: ['5%', '0%'],
    axisLine: {
      lineStyle: {
        color: ['#666666'],
        width: 1,
        type: 'solid'
      }
    }
  },
  yAxis: {
    type: 'value',
    boundaryGap: ['0%', '0%'],
    axisLine: {
      lineStyle: {
        color: ['#666666'],
        width: 1,
        type: 'solid'
      }
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#C4C4C4',
        width: 1,
        type: 'dashed'
      }
    }
  },
  series: []
}
require("echarts/theme/macarons"); //引入主题
export default {
  name: "Project",
  data() {
    return {
      myChart: null,
      tableData: [],
      doubleLineOption: lineDefaultOpt,
      Visible: false,
    };
  },
  mounted: function () {
    this.$message.success("正在加载请稍后~");
    const that = this;
    let times = [], cyclomatic_complexitys = [];
    let vids = 0, fids = 0, cids = 0, fucids = 0, num = 0;
    let url1 = '/details/version_list?' + 'user_id=' + sessionStorage.getItem("user_id")
      + '&token=' + sessionStorage.getItem("token")
      + '&pro_id=' + sessionStorage.getItem("pro_id");
    this.$axios.get(url1)
      .then((res) => {
        if (res.data.resp.status_code === 0) {

          //this.$message.success("信息获取成果成功");
          if (res.data.version_list === null) {
            Vue.prototype.$message.success("暂无版本！");
            return;
          }
          for (vids = 0; vids < res.data.version_list.length; vids++) {
            let vertemp = {
              id: Number,
              name: Number,
              pid: Number,
              ver_id: Number,
              time: Number,
              hash: String,
              length: Number,
              call_graph_id: Number,
              num_files: Number,
              num_classes: Number,
              num_methods: Number,
              num_valid_lines: Number,
              num_comment_lines: Number,
              num_blank_lines: Number,
              num_edges: Number,
              num_api: Number,
              num_comment_api: Number,
              num_api_parameters: Number,
              call_hierarchy: Number,
              coupling: Number,
              cyclomatic_complexity: Number,
              modifiability: Number,
              extensibility: Number,
              testability: Number,
              replaceability: Number,
              understandability: Number,
              pro_id: Number, datas: []
            };

            //例如将毫秒时间戳“1600336219000”转换为"YYYY-MM-dd  HH24:mi:ss"格式的string类型的时间格式
            let unix_time = res.data.version_list[vids].time;
            let temp_time = new Date(unix_time);
            let year = temp_time.getFullYear();
            let month = temp_time.getMonth() + 1;
            month = month < 10 ? "0" + month : month;
            let day = temp_time.getDate();
            day = day < 10 ? "0" + day : day;
            let hour = temp_time.getHours();
            hour = hour < 10 ? "0" + hour : hour;
            let minute = temp_time.getMinutes();
            minute = minute < 10 ? "0" + minute : minute;
            let second = temp_time.getSeconds();
            second = second < 10 ? "0" + second : second;
            let result_time = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
            vertemp.id = res.data.version_list[vids].ver_id;
            vertemp.pid = res.data.version_list[vids].ver_id;
            vertemp.name = result_time;
            vertemp.ver_id = res.data.version_list[vids].ver_id;
            vertemp.time = result_time;
            vertemp.hash = res.data.version_list[vids].hash;
            vertemp.length = res.data.version_list[vids].length;
            vertemp.call_graph_id = res.data.version_list[vids].call_graph_id;
            vertemp.num_files = res.data.version_list[vids].num_files;
            vertemp.num_classes = res.data.version_list[vids].num_classes;
            vertemp.num_methods = res.data.version_list[vids].num_methods;
            vertemp.num_valid_lines = res.data.version_list[vids].num_valid_lines;
            vertemp.num_comment_lines = res.data.version_list[vids].num_comment_lines;
            vertemp.num_blank_lines = res.data.version_list[vids].num_blank_lines;
            vertemp.num_edges = res.data.version_list[vids].num_edges;
            vertemp.num_api = res.data.version_list[vids].num_api;
            vertemp.num_comment_api = res.data.version_list[vids].num_comment_api;
            vertemp.num_api_parameters = res.data.version_list[vids].num_api_parameters;
            vertemp.call_hierarchy = res.data.version_list[vids].call_hierarchy;
            vertemp.coupling = res.data.version_list[vids].coupling;
            vertemp.cyclomatic_complexity = res.data.version_list[vids].cyclomatic_complexity;
            vertemp.modifiability = res.data.version_list[vids].modifiability;
            vertemp.extensibility = res.data.version_list[vids].extensibility;
            vertemp.testability = res.data.version_list[vids].testability;
            vertemp.replaceability = res.data.version_list[vids].replaceability;
            vertemp.understandability = res.data.version_list[vids].understandability;
            vertemp.pro_id = res.data.version_list[vids].pro_id;

            times.push(result_time.toString());
            cyclomatic_complexitys.push(parseInt(res.data.version_list[vids].cyclomatic_complexity));

            let url2 = '/details/file_list?'
              + 'user_id=' + sessionStorage.getItem("user_id")
              + '&token=' + sessionStorage.getItem("token")
              + '&ver_id=' + vertemp.ver_id;
            this.$axios.get(url2)
              .then((res1) => {
                if (res1.data.resp.status_code === 0) {
                  //this.$message.success("信息获取成果成功");
                  for (fids = 0; fids < res1.data.file_list.length; fids++) {
                    if(res1.data.file_list[fids].name.substring(res1.data.file_list[fids].name.lastIndexOf('.')+1)!=='java')
                      continue;
                    let filetemp = {
                      id: Number,
                      name: String,
                      fid: Number,
                      file_id: Number,
                      length: Number,
                      path: String,
                      num_methods: Number,
                      num_classes: Number,
                      num_valid_lines: Number,
                      num_comment_lines: Number,
                      num_blank_lines: Number,
                      num_edges: Number,
                      num_api: Number,
                      num_depend: Number,
                      call_hierarchy: Number,
                      coupling: Number,
                      cyclomatic_complexity: Number,
                      modifiability: Number,
                      extensibility: Number,
                      testability: Number,
                      replaceability: Number,
                      understandability: Number,
                      ver_id: Number,
                      datas: []
                    };

                    filetemp.id = res1.data.file_list[fids].file_id;
                    filetemp.fid = res1.data.file_list[fids].file_id;
                    filetemp.name = res1.data.file_list[fids].name;
                    filetemp.file_id = res1.data.file_list[fids].file_id;
                    filetemp.length = res1.data.file_list[fids].length;
                    filetemp.path = res1.data.file_list[fids].path;
                    filetemp.num_methods = res1.data.file_list[fids].num_methods;
                    filetemp.num_classes = res1.data.file_list[fids].num_classes;
                    filetemp.num_valid_lines = res1.data.file_list[fids].num_valid_lines;
                    filetemp.num_comment_lines = res1.data.file_list[fids].num_comment_lines;
                    filetemp.num_blank_lines = res1.data.file_list[fids].num_blank_lines;
                    filetemp.num_edges = res1.data.file_list[fids].num_edges;
                    filetemp.num_api = res1.data.file_list[fids].num_api;
                    filetemp.num_depend = res1.data.file_list[fids].num_depend;
                    filetemp.call_hierachy = res1.data.file_list[fids].call_hierachy;
                    filetemp.coupling = res1.data.file_list[fids].coupling;
                    filetemp.cyclomatic_complexity = res1.data.file_list[fids].cyclomatic_complexity;
                    filetemp.modifiability = res1.data.file_list[fids].modifiability;
                    filetemp.extensibility = res1.data.file_list[fids].extensibility;
                    filetemp.testability = res1.data.file_list[fids].testability;
                    filetemp.replaceability = res1.data.file_list[fids].replaceability;
                    filetemp.understandability = res1.data.file_list[fids].understandability;
                    filetemp.ver_id = res1.data.file_list[fids].ver_id;

                    let url3 = '/details/class_list?'
                      + 'user_id=' + sessionStorage.getItem("user_id")
                      + '&token=' + sessionStorage.getItem("token")
                      + '&file_id=' + filetemp.file_id;
                    this.$axios.get(url3)
                      .then((res2) => {
                        if (res2.data.resp.status_code === 0) {
                          //this.$message.success("信息获取成果成功");
                          for (cids = 0; cids < res2.data.class_list.length; cids++) {
                            let classtemp = {
                              id: Number,
                              cid: Number,
                              class_id: Number,
                              name: String,
                              length: Number,
                              num_methods: Number,
                              num_subclasses: Number,
                              num_valid_lines: Number,
                              num_comment_lines: Number,
                              num_blank_lines: Number,
                              num_edges: Number,
                              num_api: Number,
                              call_hierarchy: Number,
                              coupling: Number,
                              cyclomatic_complexity: Number,
                              modifiability: Number,
                              extensibility: Number,
                              testability: Number,
                              replaceability: Number,
                              understandability: Number,
                              file_id: Number,
                              out_class_id: Number,
                              num_inbound: String,
                              num_outbound: String,
                              datas: []
                            };
                            classtemp.id = res2.data.class_list[cids].class_id;
                            classtemp.cid = res2.data.class_list[cids].class_id;
                            classtemp.name = res2.data.class_list[cids].name;
                            classtemp.class_id = res2.data.class_list[cids].class_id;
                            classtemp.length = res2.data.class_list[cids].length;
                            classtemp.num_inbound = res2.data.class_list[cids].num_inbound;
                            classtemp.num_outbound = res2.data.class_list[cids].num_outbound;
                            classtemp.num_methods = res2.data.class_list[cids].num_methods;
                            classtemp.num_subclasses = res2.data.class_list[cids].num_subclasses;
                            classtemp.num_valid_lines = res2.data.class_list[cids].num_valid_lines;
                            classtemp.num_comment_lines = res2.data.class_list[cids].num_comment_lines;
                            classtemp.num_blank_lines = res2.data.class_list[cids].num_blank_lines;
                            classtemp.num_edges = res2.data.class_list[cids].num_edges;
                            classtemp.num_api = res2.data.class_list[cids].num_api;
                            classtemp.call_hierachy = res2.data.class_list[cids].call_hierachy;
                            classtemp.coupling = res2.data.class_list[cids].coupling;
                            classtemp.cyclomatic_complexity = res2.data.class_list[cids].cyclomatic_complexity;
                            classtemp.modifiability = res2.data.class_list[cids].modifiability;
                            classtemp.extensibility = res2.data.class_list[cids].extensibility;
                            classtemp.testability = res2.data.class_list[cids].testability;
                            classtemp.replaceability = res2.data.class_list[cids].replaceability;
                            classtemp.understandability = res2.data.class_list[cids].understandability;
                            classtemp.file_id = res2.data.class_list[cids].file_id;
                            if (res2.data.class_list[cids].out_class_id === undefined)
                              classtemp.out_class_id = '';
                            else
                              classtemp.out_class_id = res2.data.class_list[cids].out_class_id;

                            let url4 = '/details/method_list?'
                              + 'user_id=' + sessionStorage.getItem("user_id")
                              + '&token=' + sessionStorage.getItem("token")
                              + '&class_id=' + classtemp.class_id;
                            this.$axios.get(url4)
                              .then((res3) => {
                                if (res3.data.resp.status_code === 0) {
                                  //this.$message.success("信息获取成果成功");
                                  for (fucids = 0; fucids < res3.data.method_list.length; fucids++) {
                                    let fuctemp = {
                                      id: Number,
                                      fucid: Number,
                                      mth_id: Number,
                                      name: String,
                                      signature: String,
                                      length: Number,
                                      num_valid_lines: Number,
                                      num_comment_lines: Number,
                                      num_blank_lines: Number,
                                      num_parameters: Number,
                                      num_inbound: String,
                                      num_outbound: String,
                                      call_hierarchy: Number,
                                      cyclomatic_complexity: Number,
                                      class_id: Number
                                    };
                                    fuctemp.id = res3.data.method_list[fucids].mth_id;
                                    fuctemp.cid = res3.data.method_list[fucids].mth_id;
                                    fuctemp.name = res3.data.method_list[fucids].name;
                                    fuctemp.mth_id = res3.data.method_list[fucids].mth_id;
                                    fuctemp.signature = res3.data.method_list[fucids].signature;
                                    fuctemp.length = res3.data.method_list[fucids].length;
                                    fuctemp.num_valid_lines = res3.data.method_list[fucids].num_valid_lines;
                                    fuctemp.num_comment_lines = res3.data.method_list[fucids].num_comment_lines;
                                    fuctemp.num_blank_lines = res3.data.method_list[fucids].num_blank_lines;
                                    fuctemp.num_parameters = res3.data.method_list[fucids].num_parameters;
                                    fuctemp.num_inbound = res3.data.method_list[fucids].num_inbound;
                                    fuctemp.num_outbound = res3.data.method_list[fucids].num_outbound;
                                    fuctemp.call_hierarchy = res3.data.method_list[fucids].call_hierarchy;
                                    fuctemp.cyclomatic_complexity = res3.data.method_list[fucids].cyclomatic_complexity;
                                    fuctemp.class_id = res3.data.method_list[fucids].class_id;

                                    classtemp.datas.push(fuctemp);  //添加每一个方法
                                  }
                                } else {
                                }
                              })
                              .catch((err) => {
                                console.log(err);
                              });

                            filetemp.datas.push(classtemp);   //添加每一个类
                          }
                        } else {
                        }
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                    vertemp.datas.push(filetemp);     //添加每一个文件
                  }
                } else {
                }
              })
              .catch((err) => {
                console.log(err);
              });
            that.tableData.push(vertemp);     //添加每一个版本
          }

          /*
   //折线图
   //if(this.myChart) this.myChart.clear();
   //this.myChart = this.$echarts.init(document.getElementById("myChart"));
   //if (this.$refs.myChart){
   //  this.$refs.myChart.clear();
   //  this.$refs.myChart.dispose();
   //}
   //this.$refs.myChart = echarts.init(this.$refs.myChart);
   console.log(times);
   console.log(cyclomatic_complexitys);
   this.myChart.setOption({
     title:{text: '圈复杂度变化'},
     tooltip: {},
     xAxis: {
       type: 'category',
       data: times
     },
     yAxis: {
       type: 'value'
     },
     series: [{
       data: cyclomatic_complexitys,
       type: 'line'
     }]
   });

    */
          const list = [{
            name: '圈复杂度',
            type: 'line',
            symbol: 'circle',
            symbolSize: [5, 5],
            data: cyclomatic_complexitys
          }];
          that.doubleLineOption.series = list;
          that.doubleLineOption.xAxis.data = times;
          console.log(times);
          console.log(cyclomatic_complexitys);
          this.eChartsInit('myChart', 'light', that.doubleLineOption);
        } else {
          this.$message.error("获取信息失败");
        }
      })
      .catch((err) => {
        console.log(err);
        this.$message.error("网络错误，请稍后再试");
      });

  },
  methods: {
    Report(props) {
      sessionStorage.setItem('ver_id', props.row.pid);
      console.log(props.row.pid);
      this.$router.push('/Reportlist');
    },
    eChartsInit(domId, theme, opt) {
      this.$echarts.init(document.getElementById(domId), theme).setOption(opt)
      window.addEventListener('resize', () => {
        this.$echarts.init(document.getElementById(domId), theme).resize()
      })
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (!row.datas) {
        if (columnIndex === 0) {
          return [0, 0];
        } else if (columnIndex === 1) {
          return [1, 2];
        }
      }
    },
    loginOut: function () {
      let username = this.username;
      let password = this.password;
      console.log("username=%s,password=%s", username, password);
      let url = '/user/login';
      let url1 = '/user/logout?user_id=' + sessionStorage.getItem('user_id') + '&token=' + sessionStorage.getItem('token');

      //定义请求参数
      let params = {
        username: username,
        password: password
      };
      console.log(params);

      const getLoginInfoOk = (res) => {
        if (res.data) {
          console.log(res.data.resp.status_msg);
          if (res.data.resp.status_msg === 'OK') {
            //判断返回的是否正确密码
            sessionStorage.setItem("user_id", res.data.user_id);
            sessionStorage.setItem("token", res.data.token);
            console.log(sessionStorage.getItem('user_id'));

          } else {
            Vue.prototype.$message.error("出现错误！")
          }
        } else {
          Vue.prototype.$message.error("网络错误，请稍后再试")
        }
      }

      //发起ajax请求-Post（注意参数必须保存到params属性中）
      this.$axios.post(url1)
        .then(res => getLoginInfoOk(res))
        .catch(err => {
          Vue.prototype.$message.error("请检查网络状况")
          console.error(err);
          //console.log(err);
        });
      this.$router.push('/Login');
      sessionStorage.clear();
      Vue.prototype.$message.success("已登出")
    },
    Funcin: function (props) {
      console.log(props.row.fucid)

      sessionStorage.removeItem('fucid');
      sessionStorage.setItem("fucid", props.row.fucid);
      sessionStorage.removeItem('mth_id');
      sessionStorage.setItem("mth_id", props.row.mth_id);
      sessionStorage.removeItem('name');
      sessionStorage.setItem("name", props.row.name);
      sessionStorage.removeItem('signature');
      sessionStorage.setItem("signature", props.row.signature);
      sessionStorage.removeItem('length');
      sessionStorage.setItem("length", props.row.length);
      sessionStorage.removeItem('num_valid_lines');
      sessionStorage.setItem("num_valid_lines", props.row.num_valid_lines);
      sessionStorage.removeItem('num_comment_lines');
      sessionStorage.setItem("num_comment_lines", props.row.num_comment_lines);
      sessionStorage.removeItem('num_blank_lines');
      sessionStorage.setItem("num_blank_lines", props.row.num_blank_lines);
      sessionStorage.removeItem('num_parameters');
      sessionStorage.setItem("num_parameters", props.row.num_parameters);
      sessionStorage.removeItem('num_inbound');
      sessionStorage.setItem("num_inbound", props.row.num_inbound);
      sessionStorage.removeItem('num_outbound');
      sessionStorage.setItem("num_outbound", props.row.num_outbound);
      sessionStorage.removeItem('call_hierarchy');
      sessionStorage.setItem("call_hierarchy", props.row.call_hierarchy);
      sessionStorage.removeItem('cyclomatic_complexity');
      sessionStorage.setItem("cyclomatic_complexity", props.row.cyclomatic_complexity);
      sessionStorage.removeItem('class_id');
      sessionStorage.setItem("class_id", props.row.class_id);

      this.$router.push('/Funcinfo');
    },
    Classin: function (props) {
      console.log(props.row.cid)

      sessionStorage.removeItem('cid');
      sessionStorage.setItem("cid", props.row.cid);
      sessionStorage.removeItem('num_inbound');
      sessionStorage.setItem("num_inbound", props.row.num_inbound);
      sessionStorage.removeItem('num_outbound');
      sessionStorage.setItem("num_outbound", props.row.num_outbound);
      sessionStorage.removeItem('class_id');
      sessionStorage.setItem("class_id", props.row.class_id);
      sessionStorage.removeItem('name');
      sessionStorage.setItem("name", props.row.name);
      sessionStorage.removeItem('length');
      sessionStorage.setItem("length", props.row.length);
      sessionStorage.removeItem('num_methods');
      sessionStorage.setItem("num_methods", props.row.num_methods);
      sessionStorage.removeItem('num_subclasses');
      sessionStorage.setItem("num_subclasses", props.row.num_subclasses);
      sessionStorage.removeItem('num_valid_lines');
      sessionStorage.setItem("num_valid_lines", props.row.num_valid_lines);
      sessionStorage.removeItem('num_comment_lines');
      sessionStorage.setItem("num_comment_lines", props.row.num_comment_lines);
      sessionStorage.removeItem('num_blank_lines');
      sessionStorage.setItem("num_blank_lines", props.row.num_blank_lines);
      sessionStorage.removeItem('num_edges');
      sessionStorage.setItem("num_edges", props.row.num_edges);
      sessionStorage.removeItem('num_api');
      sessionStorage.setItem("num_api", props.row.num_api);
      sessionStorage.removeItem('call_hierarchy');
      sessionStorage.setItem("call_hierarchy", props.row.call_hierarchy);
      sessionStorage.removeItem('coupling');
      sessionStorage.setItem("coupling", props.row.coupling);
      sessionStorage.removeItem('cyclomatic_complexity');
      sessionStorage.setItem("cyclomatic_complexity", props.row.cyclomatic_complexity);
      sessionStorage.removeItem('modifiability');
      sessionStorage.setItem("modifiability", props.row.modifiability);
      sessionStorage.removeItem('extensibility');
      sessionStorage.setItem("extensibility", props.row.extensibility);
      sessionStorage.removeItem('testability');
      sessionStorage.setItem("testability", props.row.testability);
      sessionStorage.removeItem('replaceability');
      sessionStorage.setItem("replaceability", props.row.replaceability);
      sessionStorage.removeItem('understandability');
      sessionStorage.setItem("understandability", props.row.understandability);
      sessionStorage.removeItem('file_id');
      sessionStorage.setItem("file_id", props.row.file_id);
      sessionStorage.removeItem('out_class_id');
      sessionStorage.setItem("out_class_id", props.row.out_class_id);

      this.$router.push('/Classinfo');
    },
    Projectin: function (props) {
      console.log(props.row.pid);

      sessionStorage.removeItem('pid');
      sessionStorage.setItem("pid", props.row.pid);
      sessionStorage.removeItem('ver_id');
      sessionStorage.setItem("ver_id", props.row.ver_id);
      sessionStorage.removeItem('time');
      sessionStorage.setItem("time", props.row.time);
      sessionStorage.removeItem('hash');
      sessionStorage.setItem("hash", props.row.hash);
      sessionStorage.removeItem('length');
      sessionStorage.setItem("length", props.row.length);
      sessionStorage.removeItem('call_graph_id');
      sessionStorage.setItem("call_graph_id", props.row.call_graph_id);
      sessionStorage.removeItem('num_files');
      sessionStorage.setItem("num_files", props.row.num_files);
      sessionStorage.removeItem('num_classes');
      sessionStorage.setItem("num_classes", props.row.num_classes);
      sessionStorage.removeItem('num_methods');
      sessionStorage.setItem("num_methods", props.row.num_methods);
      sessionStorage.removeItem('num_valid_lines');
      sessionStorage.setItem("num_valid_lines", props.row.num_valid_lines);
      sessionStorage.removeItem('num_comment_lines');
      sessionStorage.setItem("num_comment_lines", props.row.num_comment_lines);
      sessionStorage.removeItem('num_blank_lines');
      sessionStorage.setItem("num_blank_lines", props.row.num_blank_lines);
      sessionStorage.removeItem('num_edges');
      sessionStorage.setItem("num_edges", props.row.num_edges);
      sessionStorage.removeItem('num_comment_api');
      sessionStorage.setItem("num_comment_api", props.row.num_comment_api);
      sessionStorage.removeItem('num_api_parameters');
      sessionStorage.setItem("num_api_parameters", props.row.num_api_parameters);
      sessionStorage.removeItem('num_api');
      sessionStorage.setItem("num_api", props.row.num_api);
      sessionStorage.removeItem('call_hierarchy');
      sessionStorage.setItem("call_hierarchy", props.row.call_hierarchy);
      sessionStorage.removeItem('coupling');
      sessionStorage.setItem("coupling", props.row.coupling);
      sessionStorage.removeItem('cyclomatic_complexity');
      sessionStorage.setItem("cyclomatic_complexity", props.row.cyclomatic_complexity);
      sessionStorage.removeItem('modifiability');
      sessionStorage.setItem("modifiability", props.row.modifiability);
      sessionStorage.removeItem('extensibility');
      sessionStorage.setItem("extensibility", props.row.extensibility);
      sessionStorage.removeItem('testability');
      sessionStorage.setItem("testability", props.row.testability);
      sessionStorage.removeItem('replaceability');
      sessionStorage.setItem("replaceability", props.row.replaceability);
      sessionStorage.removeItem('understandability');
      sessionStorage.setItem("understandability", props.row.understandability);
      sessionStorage.removeItem('pro_id');
      sessionStorage.setItem("pro_id", props.row.pro_id);

      this.$router.push('/Projectinfo');
    },
    Filein: function (props) {
      console.log(props.row.fid)
      sessionStorage.removeItem('fid');
      sessionStorage.setItem("fid", props.row.fid);

      sessionStorage.removeItem('file_id');
      sessionStorage.setItem("file_id", props.row.file_id);
      sessionStorage.removeItem('name');
      sessionStorage.setItem("name", props.row.name);
      sessionStorage.removeItem('path');
      sessionStorage.setItem("path", props.row.path);
      sessionStorage.removeItem('length');
      sessionStorage.setItem("length", props.row.length);
      sessionStorage.removeItem('num_classes');
      sessionStorage.setItem("num_classes", props.row.num_classes);
      sessionStorage.removeItem('num_methods');
      sessionStorage.setItem("num_methods", props.row.num_methods);
      sessionStorage.removeItem('num_valid_lines');
      sessionStorage.setItem("num_valid_lines", props.row.num_valid_lines);
      sessionStorage.removeItem('num_comment_lines');
      sessionStorage.setItem("num_comment_lines", props.row.num_comment_lines);
      sessionStorage.removeItem('num_blank_lines');
      sessionStorage.setItem("num_blank_lines", props.row.num_blank_lines);
      sessionStorage.removeItem('num_edges');
      sessionStorage.setItem("num_edges", props.row.num_edges);
      sessionStorage.removeItem('num_depend');
      sessionStorage.setItem("num_depend", props.row.num_depend);
      sessionStorage.removeItem('num_api');
      sessionStorage.setItem("num_api", props.row.num_api);
      sessionStorage.removeItem('call_hierarchy');
      sessionStorage.setItem("call_hierarchy", props.row.call_hierarchy);
      sessionStorage.removeItem('coupling');
      sessionStorage.setItem("coupling", props.row.coupling);
      sessionStorage.removeItem('cyclomatic_complexity');
      sessionStorage.setItem("cyclomatic_complexity", props.row.cyclomatic_complexity);
      sessionStorage.removeItem('modifiability');
      sessionStorage.setItem("modifiability", props.row.modifiability);
      sessionStorage.removeItem('extensibility');
      sessionStorage.setItem("extensibility", props.row.extensibility);
      sessionStorage.removeItem('testability');
      sessionStorage.setItem("testability", props.row.testability);
      sessionStorage.removeItem('replaceability');
      sessionStorage.setItem("replaceability", props.row.replaceability);
      sessionStorage.removeItem('understandability');
      sessionStorage.setItem("understandability", props.row.understandability);
      sessionStorage.removeItem('ver_id');
      sessionStorage.setItem("ver_id", props.row.ver_id);

      this.$router.push('/Fileinfo');
    },
    back: function () {
      this.$router.push('/Personal');
    },
    receive() {
      this.Visible = false
    },
    Look: function () {
      this.Visible = ref(true);
      console.log(Historydia.props);
      console.log(this.Visible);
    },
    closeDialog() {
      this.Visible = ref(false);
    }
  }

}
</script>

<style scoped>
.Back {
  position: relative;
  left: 35%;
  top: 0px;
  margin-top: 20px;
  font-weight: 800;
  font-size: 16px;
}

.Look {
  position: relative;
  left: 810px;
  top: 0px;
  font-weight: 800;
  font-size: 16px;
}

.LoginOut {
  position: relative;
  left: 55%;
  top: 0px;
  margin-top: 20px;
  font-weight: 800;
  font-size: 16px;
}

.el-table th {
  background: #ddeeff;
}

.el-table__expanded-cell {
  border-bottom: 0px;
  border-right: 0px;
  padding: 0px 0px 0px 47px;
}

.table-in-table {
  border-top: 0px;
}
</style>
