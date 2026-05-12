import DeviceActivity
import SwiftUI

struct ContentView: View {
    @StateObject private var manager = ScreenTimeManager()

    private var todayFilter: DeviceActivityFilter {
        let calendar = Calendar.current
        let startOfDay = calendar.startOfDay(for: Date())
        let endOfDay = calendar.date(byAdding: .day, value: 1, to: startOfDay) ?? Date()

        return DeviceActivityFilter(
            segment: .daily(during: DateInterval(start: startOfDay, end: endOfDay)),
            users: .all,
            devices: .all
        )
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Text("Jstar")
                        .font(.largeTitle.bold())

                    Text("Screen Time usage reports are aggregated by Apple and delivered via DeviceActivity reports.")
                        .foregroundStyle(.secondary)

                    VStack(alignment: .leading, spacing: 8) {
                        Text("Authorization: \(manager.authorizationStatusText)")
                        Text("Monitor: \(manager.monitorStatusText)")
                    }
                    .font(.subheadline)

                    Button("Request Screen Time Authorization") {
                        Task {
                            await manager.requestAuthorization()
                        }
                    }
                    .buttonStyle(.borderedProminent)

                    Button("Start Device Activity Monitor") {
                        manager.startMonitoring()
                    }
                    .buttonStyle(.bordered)

                    Text("Usage by App (Today)")
                        .font(.headline)

                    DeviceActivityReport(.jstarUsage, filter: todayFilter)
                        .frame(minHeight: 320)
                        .background(.thinMaterial, in: RoundedRectangle(cornerRadius: 12))
                }
                .padding()
            }
            .navigationTitle("Jstar")
        }
    }
}
