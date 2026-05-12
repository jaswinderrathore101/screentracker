import DeviceActivity
import SwiftUI

struct JstarAppUsage: Identifiable {
    let id: String
    let duration: TimeInterval
}

struct JstarActivityReportConfiguration {
    let totalDuration: TimeInterval
    let perAppUsage: [JstarAppUsage]
}

struct JstarActivityReportScene: DeviceActivityReportScene {
    let context: DeviceActivityReport.Context = .jstarUsage
    let content: (JstarActivityReportConfiguration) -> JstarActivityReportView

    func makeConfiguration(
        representing data: DeviceActivityResults<DeviceActivityData>
    ) async -> JstarActivityReportConfiguration {
        var durationsByApp: [String: TimeInterval] = [:]
        var totalDuration: TimeInterval = 0

        for await dailyData in data {
            for await segment in dailyData.activitySegments {
                for await category in segment.categories {
                    for await appActivity in category.applications {
                        let key = String(describing: appActivity.application.token)
                        let duration = appActivity.totalActivityDuration
                        durationsByApp[key, default: 0] += duration
                        totalDuration += duration
                    }
                }
            }
        }

        let perAppUsage = durationsByApp
            .map { JstarAppUsage(id: $0.key, duration: $0.value) }
            .sorted { $0.duration > $1.duration }

        return JstarActivityReportConfiguration(
            totalDuration: totalDuration,
            perAppUsage: perAppUsage
        )
    }
}

struct JstarActivityReportView: View {
    let configuration: JstarActivityReportConfiguration

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Total usage: \(formatted(configuration.totalDuration))")
                .font(.headline)

            if configuration.perAppUsage.isEmpty {
                Text("No app activity available for the selected period.")
                    .foregroundStyle(.secondary)
            } else {
                List(configuration.perAppUsage.prefix(20)) { item in
                    HStack {
                        Text(item.id)
                            .font(.caption)
                            .lineLimit(1)
                            .truncationMode(.middle)
                        Spacer()
                        Text(formatted(item.duration))
                            .font(.body.monospacedDigit())
                    }
                }
                .listStyle(.plain)
            }
        }
        .padding()
    }

    private func formatted(_ value: TimeInterval) -> String {
        let formatter = DateComponentsFormatter()
        formatter.allowedUnits = [.hour, .minute]
        formatter.unitsStyle = .abbreviated
        return formatter.string(from: value) ?? "0m"
    }
}
