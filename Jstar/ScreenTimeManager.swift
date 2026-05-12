import DeviceActivity
import FamilyControls
import Foundation

@MainActor
final class ScreenTimeManager: ObservableObject {
    @Published var authorizationStatusText = "Not Determined"
    @Published var monitorStatusText = "Not started"

    private let authorizationCenter = AuthorizationCenter.shared
    private let activityCenter = DeviceActivityCenter()

    func requestAuthorization() async {
        do {
            try await authorizationCenter.requestAuthorization(for: .individual)
            authorizationStatusText = "Authorized"
        } catch {
            authorizationStatusText = "Authorization failed: \(error.localizedDescription)"
        }
    }

    func startMonitoring() {
        do {
            let schedule = DeviceActivitySchedule(
                intervalStart: DateComponents(hour: 0, minute: 0),
                intervalEnd: DateComponents(hour: 23, minute: 59),
                repeats: true
            )
            try activityCenter.startMonitoring(.jstarDaily, during: schedule)
            monitorStatusText = "Monitoring started"
        } catch {
            monitorStatusText = "Start monitoring failed: \(error.localizedDescription)"
        }
    }
}
