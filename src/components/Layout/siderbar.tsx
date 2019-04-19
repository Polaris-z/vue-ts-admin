import { RouteConfig } from 'vue-router';
import { GlobalStore } from '@/store/global';
import { deepClone } from '@/utils';
import { VC, Props, Component, Watch, Inject } from '@/VC-vue';
import Layout from '.';


type ItemConfig = RouteConfig & { icon: string };
class SiderbarProps {
  /** menu是否收起状态 */
  collapsed ?= false;
}

@Props(SiderbarProps)
@Component({})
export default class Siderbar extends VC<SiderbarProps> {

  openkeys: string[] = [];
  menuList: any[] = [];

  @Inject() reloadView!: Layout['reloadView'];

  get currnetRoute() {
    return [this.$route.matched[0].path];
  }

  @Watch('collapsed') _collapsed(v) {
    this.openkeys = v ? [] : this.currnetRoute;
  }

  created() {
    this.openkeys = this.currnetRoute;
  }

  titleClick({ key }) {
    this.openkeys = this.openkeys[0] !== key ? [key] : [];
  }

  menuClick({ keyPath, key }) {
    this.$route.path === key && this.reloadView();
    this.openkeys = this.$props.collapsed ? [] : keyPath ? [keyPath[keyPath.length - 1]] : [];
    this.$router.push(key);
  }

  menuItem(r: ItemConfig) {
    return (
      <a-menu-item key={r.path}>
        {r.meta.icon && <a-icon type={r.meta.icon} />}
        <span class='padding-left'>{r.meta.title}</span>
      </a-menu-item >
    );
  }
  subItem(r: ItemConfig) {
    return (
      <a-sub-menu
        key={r.path}
        onTitleClick={this.titleClick}
      >
        <span slot='title'>
          <a-icon type={r.meta.icon} />
          <span class='padding-left'>{r.meta.title}</span>
        </span>
        {(r.children as ItemConfig[]).map((i) => this.menuItem(i))}
      </a-sub-menu>
    );
  }


  render() {
    const routerMaps = deepClone(GlobalStore.asyncRoutes);
    const loop = (arr) => arr.map((r) => {
      if (r.children) {
        // 当子路由同父路由的path相同时,隐藏子路由菜单
        r.children[0].path === r.path ?
          r.children = undefined :
          loop(r.children);
      }
    });
    loop(routerMaps);

    return (
      <a-menu
        onClick={this.menuClick}
        defaultSelectedKeys={[this.$route.path]}
        openKeys={this.openkeys}
        mode='inline'
        theme='dark'
        style='padding:16px 0' >
        {routerMaps.map((r: ItemConfig) => (
          r.children && r.children.length > 0
            ? this.subItem(r)
            : this.menuItem(r)
        ))}
      </a-menu>
    );
  }
}
