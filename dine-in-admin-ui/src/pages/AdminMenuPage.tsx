import React, { useState, useEffect } from "react";
import {
  useGetAdminCategoriesQuery,
  useCreateCategoryMutation,
  useGetAdminItemsQuery,
  useCreateItemMutation,
  useDeleteItemMutation,
} from "@features/menu/menuApi";
import { Plus, Trash2, ChevronRight, Clock } from "lucide-react";
import Button from "@components/ui/Button";
import Card from "@components/ui/Card";
import Badge from "@components/ui/Badge";
import Input from "@components/ui/Input";
import Dialog from "@components/ui/Dialog";
import type { DialogHandle } from "@components/ui/Dialog";

const AdminMenuPage: React.FC = () => {
  const { data: categories = [] } = useGetAdminCategoriesQuery();
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const { data: items = [] } = useGetAdminItemsQuery(currentCategory!, {
    skip: !currentCategory,
  });

  const [createCategory] = useCreateCategoryMutation();
  const [createItem] = useCreateItemMutation();
  const [deleteItemMutation] = useDeleteItemMutation();

  const catDialogRef = React.useRef<DialogHandle>(null);
  const itemDialogRef = React.useRef<DialogHandle>(null);
  const [newCat, setNewCat] = useState({ name: "", description: "" });
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    foodType: "VEG",
    servingWindow: { start: "00:00", end: "23:59" },
  });

  useEffect(() => {
    if (categories.length > 0 && !currentCategory) {
      setCurrentCategory(categories[0]._id);
    }
  }, [categories, currentCategory]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategory(newCat).unwrap();
      catDialogRef.current?.hide();
      setNewCat({ name: "", description: "" });
    } catch (err) {
      alert("Failed to create category");
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createItem({ ...newItem, categoryId: currentCategory }).unwrap();
      itemDialogRef.current?.hide();
      setNewItem({
        name: "",
        description: "",
        price: 0,
        categoryId: "",
        foodType: "VEG",
        servingWindow: { start: "00:00", end: "23:59" },
      });
    } catch (err) {
      alert("Failed to create item");
    }
  };

  const deleteItem = async (id: string) => {
    if (confirm("Delete this item?") && currentCategory) {
      try {
        await deleteItemMutation({ id, categoryId: currentCategory }).unwrap();
      } catch (err) {
        alert("Failed to delete item");
      }
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-black text-primary ">Menu Builder</h2>
          <p className="text-muted font-bold mt-1 text-sm  tracking-normal">
            Categorize and manage your restaurant's digital menu.
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="secondary"
            onClick={() => catDialogRef.current?.show()}
            className="p-3! text-xs!"
            icon={<Plus size={18} />}
          >
            CATEGORY
          </Button>
          <Button
            onClick={() => itemDialogRef.current?.show()}
            icon={<Plus size={18} strokeWidth={3} />}
            className="shadow-primary-500/20 p-3! text-xs!"
          >
            ADD ITEM
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1 space-y-3">
          <h4 className="text-md font-black text-muted tracking-wide px-4 mb-4">
            Menu Categories
          </h4>
          {categories.map((cat: any) => (
            <button
              key={cat._id}
              onClick={() => setCurrentCategory(cat._id)}
              className={` cursor-pointer w-full flex items-center justify-between px-6 py-4 rounded-2xl font-black text-sm tracking-tight transition-all duration-300 ${
                currentCategory === cat._id
                  ? "bg-surface text-primary-600 shadow-xl shadow-surface-200/50 dark:shadow-black/20 border border-primary-100 dark:border-primary-800/50 scale-[1.05]"
                  : "text-muted hover:text-primary hover:bg-surface-100 dark:hover:text-gray-950"
              }`}
            >
              {cat.name}
              {currentCategory === cat._id ? (
                <ChevronRight
                  size={16}
                  strokeWidth={3}
                  className="animate-in slide-in-from-left-2"
                />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-surface-200 dark:bg-surface-700" />
              )}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item: any) => (
              <Card
                key={item._id}
                className="p-0 overflow-hidden flex gap-5 group hover:-translate-y-1 transition-all duration-500 border-none shadow-xl shadow-surface-200/50 dark:shadow-black/20"
              >
                <div className="w-32 h-full bg-surface-100 shrink-0 overflow-hidden relative">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-surface-200 dark:bg-surface-700">
                      🍔
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge
                      variant={item.foodType === "VEG" ? "active" : "error"}
                      className="text-[8px]! px-2! py-0.5! border-white dark:border-surface-800 shadow-sm"
                    >
                      {item.foodType}
                    </Badge>
                  </div>
                </div>
                <div className="grow py-6 pr-6 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-black text-primary truncate text-lg tracking-tighter">
                        {item.name}
                      </h3>
                      <span className="font-black text-primary-600 text-lg">
                        ₹{item.price}
                      </span>
                    </div>
                    <p className="text-xs text-muted font-bold mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2 text-[10px] text-muted font-black uppercase tracking-widest px-2 py-1 bg-surface-100 rounded-lg">
                      <Clock size={12} strokeWidth={3} />
                      {item.servingWindow?.start} - {item.servingWindow?.end}
                    </div>
                    <Button
                      variant="danger"
                      onClick={() => deleteItem(item._id)}
                      title="Delete Menu"
                      className="p-2! text-muted bg-transparent! hover:text-error hover:bg-error/10 opacity-0 group-hover:opacity-100 border rounded-full border-red-400"
                    >
                      <Trash2 color="red" size={16} strokeWidth={2} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {items.length === 0 && (
            <div className="bg-surface-100 rounded-3xl p-16 text-center border border-color border-dashed">
              <div className="text-6xl mb-6">🍽️</div>
              <h3 className="font-black text-primary text-xl tracking-tighter">
                Empty Showcase
              </h3>
              <p className="text-muted text-[10px] font-black uppercase tracking-widest mt-2 leading-relaxed max-w-[200px] mx-auto">
                This category has no items yet. Register one to see it here.
              </p>
              <Button
                variant="ghost"
                onClick={() => itemDialogRef.current?.show()}
                className="mt-6 font-black text-primary-600 uppercase text-[10px] tracking-widest hover:bg-primary-50"
              >
                + Register First Item
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog id="add-category-dialog" ref={catDialogRef}>
        <Card className="w-full max-w-md min-w-md overflow-hidden shadow-2xl border-none">
          <div className="bg-primary-600 p-10 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 -rotate-12">
              <Plus size={80} strokeWidth={5} />
            </div>
            <h3 className="text-3xl font-black tracking-tighter relative z-10">
              New Category
            </h3>
            <p className="text-primary-100 text-md font-black mt-2 relative z-10">
              Group Menu Items into categories
            </p>
          </div>
          <form
            onSubmit={handleCreateCategory}
            className="p-10 space-y-8 bg-surface"
          >
            <Input
              label="Section Identity"
              required
              placeholder="e.g. Main Course"
              value={newCat.name}
              onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
            />
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => catDialogRef.current?.hide()}
                className="flex-1 font-black text-[10px] tracking-widest border-none bg-surface-100"
              >
                Discard
              </Button>
              <Button type="submit" className="flex-1">
                Save Category
              </Button>
            </div>
          </form>
        </Card>
      </Dialog>

      <Dialog id="add-item-dialog" ref={itemDialogRef}>
        <Card className="w-full max-w-lg overflow-hidden shadow-2xl border-none">
          <div className="bg-primary-600 p-10 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
              <Plus size={100} strokeWidth={8} />
            </div>
            <h3 className="text-3xl font-black tracking-tighter relative z-10">
              New Delicacy
            </h3>
            <p className="text-primary-100 text-sm font-black mt-2 relative z-10">
              Register Menu Listing
            </p>
          </div>
          <form
            onSubmit={handleCreateItem}
            className="p-10 space-y-8 bg-surface"
          >
            <Input
              label="Item Name"
              required
              placeholder="e.g. Truffle Pasta"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-8">
              <Input
                label="Price (₹)"
                required
                type="number"
                min="0"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    price: parseInt(e.target.value),
                  })
                }
              />
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1 input-label">
                  Dietary Focus
                </label>
                <select
                  className="w-full bg-surface-100 border border-gray-500 rounded-2xl px-6 py-4 text-primary font-black text-sm outline-none focus:ring-4 focus:ring-primary-500/10 transition-all cursor-pointer"
                  value={newItem.foodType}
                  onChange={(e) =>
                    setNewItem({ ...newItem, foodType: e.target.value })
                  }
                >
                  <option className="input-label" value="VEG">
                    VEGETARIAN
                  </option>
                  <option className="input-label" value="NON_VEG">
                    NON-VEG
                  </option>
                  <option className="input-label" value="VEGAN">
                    VEGAN
                  </option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <Input
                label="Service Start"
                type="time"
                value={newItem.servingWindow.start}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    servingWindow: {
                      ...newItem.servingWindow,
                      start: e.target.value,
                    },
                  })
                }
              />
              <Input
                label="Service End"
                type="time"
                value={newItem.servingWindow.end}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    servingWindow: {
                      ...newItem.servingWindow,
                      end: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => itemDialogRef.current?.hide()}
                className="flex-1 text-[10px] border-none bg-surface-100"
              >
                Discard
              </Button>
              <Button type="submit" className="flex-2">
                Save Listing
              </Button>
            </div>
          </form>
        </Card>
      </Dialog>
    </div>
  );
};

export default AdminMenuPage;
