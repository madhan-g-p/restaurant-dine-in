import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { fetchMenuItems } from "../features/menu/menuSlice";
import MenuItemComponent from "../components/menu/MenuItem";
import Pagination from "../components/ui/Pagination";
import Loader from "../components/ui/Loader";
import ErrorMessage from "../components/ui/ErrorMessage";

export default function MenuPage() {
  const dispatch = useAppDispatch();
  const { items, currentPage, totalPages, loading, error } = useAppSelector(
    (s) => s.menu,
  );

  useEffect(() => {
    dispatch(fetchMenuItems(currentPage));
  }, [dispatch, currentPage]);

  const handlePageChange = (page: number) => {
    dispatch(fetchMenuItems(page));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Our Menu
        </h1>
        <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
          Discover delicious dishes prepared just for you
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6">
          <ErrorMessage
            message={error}
            onRetry={() => dispatch(fetchMenuItems(currentPage))}
          />
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !items.length && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="skeleton h-48 w-full rounded-none" />
              <div className="p-4 space-y-3">
                <div className="skeleton h-5 w-3/4" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-1/2" />
                <div className="flex justify-between items-center pt-2">
                  <div className="skeleton h-6 w-16" />
                  <div className="skeleton h-10 w-28 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading overlay for page transitions */}
      {loading && items.length > 0 && (
        <Loader message="Loading menu items..." />
      )}

      {/* Menu grid */}
      {!loading && items.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <MenuItemComponent key={item._id} item={item} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Empty state */}
      {!loading && !error && items.length === 0 && (
        <div className="text-center py-20">
          <span className="text-5xl">🍽️</span>
          <p
            className="text-lg font-medium mt-4"
            style={{ color: "var(--text-secondary)" }}
          >
            No menu items available
          </p>
        </div>
      )}
    </div>
  );
}
