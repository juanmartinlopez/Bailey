import { MdLocationOn, MdStorefront } from "react-icons/md";
import { useCartContext } from "../../context";
import { useBranch } from "../../hooks";

const BUE_TIME_ZONE = "America/Argentina/Buenos_Aires";

function parseMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function getCurrentBuenosAiresMinutes() {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: BUE_TIME_ZONE,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  const parts = formatter.formatToParts(new Date());
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);

  return hour * 60 + minute;
}

function isBranchOpenNow(openAt: string, closeAt: string) {
  const currentMinutes = getCurrentBuenosAiresMinutes();
  const openMinutes = parseMinutes(openAt);
  const closeMinutes = parseMinutes(closeAt);

  if (closeMinutes <= openMinutes) {
    return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
  }

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

// function getGoogleMapsUrl(lat: number, lng: number) {
//   const query = `${lat},${lng}`;
//   return `https://www.google.com/maps?q=${query}`;
// }

function BranchStatusCard() {
  const { cart } = useCartContext();
  const { branches, selectedBranch, distanceFromUserKm, changeBranch } = useBranch();

  const branchIsOpen = isBranchOpenNow(selectedBranch.hours.opensAt, selectedBranch.hours.closesAt);
  // const mapsUrl = getGoogleMapsUrl(selectedBranch.lat, selectedBranch.lng);

  const handleBranchChange = async (branchId: string) => {
    const nextBranch = branches.find((branch) => branch.id === branchId);
    if (!nextBranch) return;

    await changeBranch(nextBranch, cart);
  };

  return (
    <section className="md:hidden px-4 pt-3 pb-2">
      <div className="rounded-[28px] border border-gray-200 bg-white shadow-[0_18px_45px_rgba(17,24,39,0.08)] p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary-red/10 flex items-center justify-center text-primary-red">
              <MdStorefront className="text-2xl" />
            </div>
            <div>
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                  branchIsOpen
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {branchIsOpen ? "Sucursal abierta" : "Sucursal cerrada"}
              </span>
              <h2 className="mt-2 text-xl font-bold text-gray-900">
                {selectedBranch.name}
              </h2>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 rounded-3xl bg-gray-50 p-4 text-sm text-gray-700">
          <div className="flex gap-3">
            <span className="min-w-20 font-semibold text-gray-500">Horario</span>
            <div>
              <p>{selectedBranch.hours.days}</p>
              <p>
                {selectedBranch.hours.opensAt} a {selectedBranch.hours.closesAt}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="min-w-20 font-semibold text-gray-500">Dirección</span>
            <a
              href={`https://www.google.com/maps?q=${selectedBranch.lat},${selectedBranch.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-1 text-primary-red underline decoration-primary-red/30 underline-offset-4 transition-colors hover:text-primary-red/80"
              aria-label={`Abrir ${selectedBranch.name} en Google Maps`}
            >
              <MdLocationOn className="mt-0.5 shrink-0 text-primary-red" />
              <span>{selectedBranch.address}</span>
            </a>
          </div>
          <div className="flex gap-3">
            <span className="min-w-20 font-semibold text-gray-500">Distancia</span>
            <p>
              {distanceFromUserKm !== null
                ? `${distanceFromUserKm.toFixed(1)} km desde tu posición`
                : "Activá la ubicación para calcular la distancia"}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {branches.map((branch) => {
            const isActive = branch.id === selectedBranch.id;

            return (
              <button
                key={branch.id}
                type="button"
                onClick={() => handleBranchChange(branch.id)}
                className={`rounded-2xl border px-3 py-3 text-left transition-colors ${
                  isActive
                    ? "border-primary-red bg-primary-red/10 text-primary-red"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
                aria-pressed={isActive}
              >
                <span className="block text-sm font-semibold">{branch.name}</span>
                <span className="mt-1 block text-[11px] uppercase tracking-wide text-gray-500">
                  {branch.hours.opensAt} a {branch.hours.closesAt}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
          <MdLocationOn className="text-primary-red" />
          <span>La app elige sola la sucursal más cercana usando tu ubicación.</span>
        </div>
      </div>
    </section>
  );
}

export default BranchStatusCard;