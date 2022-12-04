import Vue from 'vue'
import Router from 'vue-router'
import Personal from '../components/Personal'
import Login from '../components/Login'
import Register from '../components/Register'
import Project from "../components/Project";
import Funcinfo from "../components/Funcinfo";
import Classinfo from "../components/Classinfo";
import Projectinfo from "../components/Projectinfo";
import Fileinfo from "../components/Fileinfo";
import Reportlist from "../components/Reportlist";
import Reportcontent from "../components/Reportcontent";
import Reportcontent2 from "../components/Reportcontent2";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/personal',
      name: 'Personal',
      component: Personal
    },
    {
      //登录页
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/project',
      name: 'Project',
      component: Project
    },
    {
      path: '/funcinfo',
      name: 'Funcinfo',
      component: Funcinfo
    },
    {
      path: '/fileinfo',
      name: 'Fileinfo',
      component: Fileinfo
    },
    {
      path: '/classinfo',
      name: 'Classinfo',
      component: Classinfo
    },
    {
      path: '/projectinfo',
      name: 'Projectinfo',
      component: Projectinfo
    },
    {
      path: '/reportlist',
      name: 'Reportlist',
      component: Reportlist
    },
    {
      path: '/reportcontent',
      name: 'Reportcontent',
      component: Reportcontent
    },
    {
      path: '/reportcontent2',
      name: 'Reportcontent2',
      component: Reportcontent2
    }
  ]
})
