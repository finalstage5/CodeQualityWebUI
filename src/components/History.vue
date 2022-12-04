<template>
  <div>
    <div>
      <el-table
        :data="tableData"
        style="width: 1040px;margin-bottom: 20px;margin-left: 200px;"
        :span-method="arraySpanMethod"
        row-key="id"
        border
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table
              class="table-in-table"
              :data="props.row.datas"
              style="width: 100%;margin-left: 20px;"
              row-key="id"
              :span-method="arraySpanMethod"
              border
            >
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-table
                    class="table-in-table"
                    :data="props.row.datas"
                    style="width: 100%;margin-left: 20px;"
                    row-key="id"
                    :span-method="arraySpanMethod"
                    border
                  >
                    <el-table-column type="expand">
                      <template slot-scope="props">
                        <el-table
                          class="table-in-table"
                          :data="props.row.datas"
                          style="width: 100%;margin-left: 66px;"
                          row-key="id"
                          border
                        >
                          <el-table-column prop="name" label="方法名" width="520"></el-table-column>
                          <el-table-column prop="fucid" label="方法id" width="249" align="center"></el-table-column>
                          <el-table-column label="操作" width="160" align="center">
                            <template slot-scope="props">
                              <el-button v-wave type="text" size="small" align="center" @click="Funcin(props)">查看具体分析</el-button>
                            </template>
                          </el-table-column>
                        </el-table>
                      </template>
                    </el-table-column>

                    <el-table-column prop="name" label="类名" width="540"></el-table-column>
                    <el-table-column prop="cid" label="类id" width="249" align="center"></el-table-column>
                    <el-table-column label="操作" width="160" align="center">
                      <template slot-scope="props">
                        <el-button v-wave type="text" size="small" align="center" @click="Classin(props)">查看具体分析</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>

              <el-table-column prop="name" label="文件名" width="560"></el-table-column>
              <el-table-column prop="fid" label="文件id" width="249" align="center"></el-table-column>
              <el-table-column label="操作" width="160" align="center">
                <template slot-scope="props">
                  <el-button v-wave type="text" size="small" align="center" @click="Filein(props)">查看具体分析</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="项目名" width="580"></el-table-column>
        <el-table-column prop="pid" label="项目id" width="249" align="center"></el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="props">
            <el-button v-wave type="text" size="small" align="center" @click="Projectin(props)">查看具体分析</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button v-wave class="Back" type="primary" @click="back">返回</el-button>
      <el-button v-wave class="Look" type="primary" @click="Look">查看其他历史版本</el-button>
      <el-button v-wave class="LoginOut" type="warning" @click="loginOut">登出</el-button>

    </div>

    <Historydia :dialogVisible="Visible" @childFn="receive"></Historydia>

  </div>

</template>

<script>
import Vue, {ref} from "vue";
import Historydia from "./Historydia";
export default {
  name: "History",
  components: {
    Historydia
  },
  data() {
    return {
      tableData: [
        {
          id: 1,
          name: "李四",
          pid: 1
        },
        {
          id: 2,
          name: "张三",
          pid: 2
        },
        {
          id: 3,
          name: "王五",
          pid: 3,
          datas: [
            {
              id: 31,
              name: "王五",
              fid: 31,
              datas: [
                {
                  id: 31,
                  name: "2016-05-01",
                  cid: 31,
                  datas: [
                    {
                      id: 31,
                      name: "2016-05-01",
                      fucid: 31
                    },
                    {
                      id: 32,
                      name: "2016-05-01",
                      fucid:32
                    }
                  ]
                },
                {
                  id: 32,
                  name: "2016-05-01",
                  cid:32,
                  datas: [
                    {
                      id: 31,
                      name: "2016-05-01",
                      fucid: 31
                    },
                    {
                      id: 32,
                      name: "2016-05-01",
                      fucid:32
                    }
                  ]
                }
              ]
            },
            {
              id: 32,
              fid: 32,
              name: "王五"
            }
          ]
        },
        {
          id: 4,
          pid: 4,
          name: "赵6六"
        }
      ],
      Visible: false,
    };
  },
  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (!row.datas) {
        if (columnIndex === 0) {
          return [0, 0];
        } else if (columnIndex === 1) {
          return [1, 2];
        }
      }
    },
    loginOut:function(){
      sessionStorage.clear();
      this.$router.push('/Login');
      Vue.prototype.$message.success("已登出")
    },
    Funcin:function ( props ){
      console.log(props.row.fucid)
      this.$router.push('/Funcinfo');
    },
    Classin:function ( props ){
      console.log(props.row.cid)
      this.$router.push('/Classinfo');
    },
    Projectin:function ( props ){
      console.log(props.row.pid)
      this.$router.push('/Projectinfo');
    },
    Filein:function ( props ){
      console.log(props.row.fid)
      this.$router.push('/Fileinfo');
    },
    back:function (){
      this.$router.push('/Project');
    },
    receive(){
      this.Visible=false
    },
    Look:function (){
      this.Visible = ref(true);
      console.log(Historydia.props);
      console.log(this.Visible);
    },
    closeDialog(){
      this.Visible = ref(false);
    }
  }

}
</script>

<style scoped>
.Back{
  position: relative;left:500px;top:0px;
  font-weight: 800;
  font-size: 16px;
}
.Look{
  position: relative;left:610px;top:0px;
  font-weight: 800;
  font-size: 16px;
}
.LoginOut{
  position: relative;left:720px;top:0px;
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
