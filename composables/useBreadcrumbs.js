export default function useBreadcrumbs() {
  const breadcrumbs = useState("breadcrumbs", () => [
    { name: "index", nameToDisplay: "Главная" },
  ]);

  function updateBreadcrumbs(route) {
    if (!route) return;
    if (route.meta.breadcrumb) {
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

  function changeRoute(breadcrumb) {
    return navigateTo({
      name: breadcrumb.name,
      params: breadcrumb.params,
      query: breadcrumb.query,
    });
  }

  function addBreadcrumb(route) {
    if (route) {
      const currentRoute = {
        name: route.name,
        params: route.params || null,
        query: route.query || null,
        nameToDisplay: route.meta.breadcrumb,
      };
      breadcrumbs.value.push(currentRoute);
    }
  }

  function deleteNextBreadcrumbs(idx) {
    breadcrumbs.value.splice(idx + 1);
  }

  function replaceLastBreadcrumbWith(route) {
    breadcrumbs.value.pop();
    addBreadcrumb(route);
  }

  function initialiseBreadcrumbs() {
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
