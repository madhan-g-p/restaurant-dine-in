import React, { useState } from "react";
import {
  useGetAdminTablesQuery,
  useCreateTableMutation,
  useDeleteTableMutation,
} from "@features/tables/tablesApi";
import adminApi from "@api/admin";
import { Plus, Trash2, Download } from "lucide-react";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import Card from "@components/ui/Card";
import Badge from "@components/ui/Badge";
import Dialog from "@components/ui/Dialog";
import type { DialogHandle } from "@components/ui/Dialog";

const INIT_TABLE = {
  tableNumber: "",
  seatCount: 2,
  floorNumber: 1,
};

const AdminTablesPage: React.FC = () => {
  const { data: tables = [], isLoading: loading } = useGetAdminTablesQuery();
  const [createTable] = useCreateTableMutation();
  const [deleteTable] = useDeleteTableMutation();

  const dialogRef = React.useRef<DialogHandle>(null);
  const [newTable, setNewTable] = useState(INIT_TABLE);

  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTable(newTable).unwrap();
      setNewTable(INIT_TABLE);
      dialogRef.current?.hide();
    } catch (err: any) {
      alert(err.data?.message || "Failed to create table");
    }
  };

  const handleDeleteTable = async (id: string) => {
    if (confirm("Are you sure you want to delete this table?")) {
      try {
        await deleteTable(id).unwrap();
      } catch (err) {
        alert("Failed to delete table");
      }
    }
  };

  const downloadQR = async (id: string, tableNum: string) => {
    try {
      const res = await adminApi.downloadQr(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Table-${tableNum}-QR.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download QR");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-black text-primary tracking-tighter">
            Table Master
          </h2>
          <p className="text-muted font-bold mt-1 text-sm ">
            Configure floor layout and scan identifiers.
          </p>
        </div>
        <Button
          onClick={() => dialogRef.current?.show()}
          icon={<Plus size={18} strokeWidth={3} />}
          className="shadow-primary-500/20 px-8"
        >
          New Table
        </Button>
      </header>

      {/* Table List */}
      <Card className="overflow-hidden border-none shadow-2xl shadow-surface-200/50 dark:shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-100 border-b border-color">
                <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.2em]">
                  Identifier
                </th>
                <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.2em]">
                  Location
                </th>
                <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.2em]">
                  Capacity
                </th>
                <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.2em] text-right">
                  Management
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-color bg-surface">
              {tables.map((table: any) => (
                <tr
                  key={table._id}
                  className="hover:bg-surface-100/50 transition-colors group"
                >
                  <td className="px-10 py-6">
                    <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/10 text-primary-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-sm border border-primary-100 dark:border-primary-800/50 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 cursor-pointer">
                      {table.tableNumber}
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <Badge variant="active" className="px-4 py-2 rounded-xl">
                      FLOOR {table.floorNumber}
                    </Badge>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-black text-primary">
                        {table.seatCount}
                      </span>
                      <span className="text-[10px] font-black text-muted uppercase tracking-widest px-2 py-0.5 bg-surface-100 rounded-lg">
                        Seats
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="secondary"
                        onClick={() => downloadQR(table._id, table.tableNumber)}
                        className="p-3! rounded-2xl!"
                        title="Download QR"
                      >
                        <Download size={18} strokeWidth={3} />
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleDeleteTable(table._id)}
                        className="p-3! rounded-2xl! text-error hover:border-error hover:bg-error/5"
                        title="Delete Table"
                      >
                        <Trash2 size={18} strokeWidth={3} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tables.length === 0 && !loading && (
          <div className="p-24 text-center flex flex-col items-center justify-center opacity-40">
            <div className="text-8xl mb-8">🪑</div>
            <p className="font-black text-primary text-2xl tracking-tighter">
              The floor is empty.
            </p>
            <p className="text-muted text-xs font-black uppercase tracking-[0.2em] mt-3">
              Register your first table to begin.
            </p>
          </div>
        )}
      </Card>

      <Dialog id="add-table-dialog" ref={dialogRef}>
        <Card className="w-full max-w-md overflow-hidden shadow-2xl border-none">
          <div className="bg-primary-600 p-12 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 p-4 opacity-10 rotate-45">
              <Plus size={100} strokeWidth={10} />
            </div>
            <h3 className="text-3xl font-black tracking-tighter relative z-10">
              New Identifier
            </h3>
            <p className="text-primary-100 text-[10px] font-black uppercase tracking-[0.3em] mt-2 opacity-70 relative z-10">
              Register Table Token
            </p>
          </div>
          <form
            onSubmit={handleCreateTable}
            className="p-10 space-y-8 bg-surface"
          >
            <Input
              label="Table Identifier"
              required
              type="text"
              placeholder="e.g. T-101"
              value={newTable.tableNumber}
              onChange={(e) =>
                setNewTable({ ...newTable, tableNumber: e.target.value })
              }
            />
            <div className="grid grid-cols-2 gap-6">
              <Input
                label="Floor Level"
                required
                type="number"
                min="0"
                value={newTable.floorNumber}
                onChange={(e) =>
                  setNewTable({
                    ...newTable,
                    floorNumber: parseInt(e.target.value),
                  })
                }
              />
              <Input
                label="Seating Cap"
                required
                type="number"
                min="1"
                value={newTable.seatCount}
                onChange={(e) =>
                  setNewTable({
                    ...newTable,
                    seatCount: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => dialogRef.current?.hide()}
                className="flex-1 text-[10px] border-none bg-surface-100"
              >
                DISCARD
              </Button>
              <Button type="submit" className="flex-2">
                SAVE TABLE
              </Button>
            </div>
          </form>
        </Card>
      </Dialog>
    </div>
  );
};

export default AdminTablesPage;
