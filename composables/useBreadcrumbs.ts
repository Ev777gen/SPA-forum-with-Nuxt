import { RouteParamsRaw, LocationQueryRaw, RouteLocationNormalizedLoaded, RouteMeta } from 'vue-router';

export interface IBreadcrumb {
  name: string | undefined,
  params?: RouteParamsRaw,
  query?: LocationQueryRaw,
  nameToDisplay: string | undefined,
}

export interface IRoute extends RouteLocationNormalizedLoaded {
  meta: RouteMeta & { breadcrumb?: string },
}

//RouteLocationNormalizedLoaded

export default function useBreadcrumbs() {
  const breadcrumbs = useState<IBreadcrumb[]>("breadcrumbs", () => [
    { name: "index", nameToDisplay: "Главная" },
  ]);

  function updateBreadcrumbs(route: IRoute): void {
    if (!route) return;
    if (route.meta?.breadcrumb) {
      const lastIndex = breadcrumbs.value.length - 1;
      const currentIndex = breadcrumbs.value.findIndex(
        (breadcrumb) => breadcrumb.name === route.name
      );
      const hasSameNameAsLast =
        breadcrumbs.value[lastIndex].name === route.name;
      const isHomePage = route.path === "/";
      const isPageAdded = currentIndex > 0 && currentIndex <= lastIndex;

      if (!isPageAdded && !isHomePage) {
        addBreadcrumb(route);
      } else if (isPageAdded && hasSameNameAsLast) {
        replaceLastBreadcrumbWith(route);
      } else {
        deleteNextBreadcrumbs(currentIndex);
      }
    } else {
      initialiseBreadcrumbs();
    }
  }

  function changeRoute(breadcrumb: IBreadcrumb) {
    return navigateTo({
      name: breadcrumb.name,
      params: breadcrumb.params,
      query: breadcrumb.query,
    });
  }

  function addBreadcrumb(route: IRoute): void {
    if (route) {
      const currentRoute: IBreadcrumb = {
        name: route.name?.toString(),
        params: route.params,
        query: route.query,
        nameToDisplay: route.meta?.breadcrumb,
      };
      breadcrumbs.value.push(currentRoute);
    }
  }

  function deleteNextBreadcrumbs(idx: number): void {
    breadcrumbs.value.splice(idx + 1);
  }

  function replaceLastBreadcrumbWith(route: IRoute): void {
    breadcrumbs.value.pop();
    addBreadcrumb(route);
  }

  function initialiseBreadcrumbs(): void {
    if (breadcrumbs.value.length > 0) {
      deleteNextBreadcrumbs(0);
    } else {
      breadcrumbs.value.push({ name: "index", nameToDisplay: "Главная" });
    }
  }

  return {
    changeRoute,
    initialiseBreadcrumbs,
    updateBreadcrumbs,
  };

  //persist: true,
}
