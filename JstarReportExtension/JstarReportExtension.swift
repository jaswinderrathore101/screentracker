import DeviceActivity

@main
struct JstarReportExtension: DeviceActivityReportExtension {
    var body: some DeviceActivityReportScene {
        JstarActivityReportScene { configuration in
            JstarActivityReportView(configuration: configuration)
        }
    }
}
