/**
 * Integration tests for Employee server actions
 * Run with: npx tsx test-employee-actions.ts
 */

import { getAllEmployees, getEmployeeWithOrders } from "./db/actions/employees";

// ANSI color codes for terminal output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
};

function log(color: keyof typeof colors, message: string) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  log("blue", "\n🧪 Running Employee Actions Tests...\n");

  // Test 1: getAllEmployees should return success
  try {
    log("yellow", "Test 1: getAllEmployees returns success");
    const result = await getAllEmployees();
    if (result.success && result.data && result.data.length > 0) {
      log("green", "✓ PASS: getAllEmployees returned data");
      passed++;
    } else {
      log("red", "✗ FAIL: getAllEmployees did not return data");
      failed++;
    }
  } catch (error) {
    log("red", `✗ FAIL: getAllEmployees threw error: ${error}`);
    failed++;
  }

  // Test 2: getEmployeeWithOrders with valid ID
  try {
    log("yellow", "\nTest 2: getEmployeeWithOrders with valid ID (1)");
    const result = await getEmployeeWithOrders("1");
    if (
      result.success &&
      result.data &&
      result.data.employee &&
      result.data.orders &&
      result.data.stats
    ) {
      log("green", "✓ PASS: Valid ID returns employee, orders, and stats");
      log(
        "green",
        `  - Employee: ${result.data.employee.firstName} ${result.data.employee.lastName}`
      );
      log("green", `  - Orders count: ${result.data.orders.length}`);
      log("green", `  - Stats: ${result.data.stats.totalOrders} total, ${result.data.stats.uniqueCustomers} unique customers`);
      passed++;
    } else {
      log("red", "✗ FAIL: Valid ID did not return expected data");
      failed++;
    }
  } catch (error) {
    log("red", `✗ FAIL: getEmployeeWithOrders threw error: ${error}`);
    failed++;
  }

  // Test 3: getEmployeeWithOrders with invalid ID (non-numeric)
  try {
    log("yellow", "\nTest 3: getEmployeeWithOrders with invalid ID (abc)");
    const result = await getEmployeeWithOrders("abc");
    if (!result.success && result.error === "Invalid employee ID") {
      log("green", "✓ PASS: Invalid ID returns proper error");
      passed++;
    } else {
      log("red", "✗ FAIL: Invalid ID did not return proper error");
      console.log("  Result:", result);
      failed++;
    }
  } catch (error) {
    log("red", `✗ FAIL: Invalid ID threw unexpected error: ${error}`);
    failed++;
  }

  // Test 4: getEmployeeWithOrders with non-existent ID
  try {
    log("yellow", "\nTest 4: getEmployeeWithOrders with non-existent ID (99999)");
    const result = await getEmployeeWithOrders("99999");
    if (!result.success && result.error === "Employee not found") {
      log("green", "✓ PASS: Non-existent ID returns proper error");
      passed++;
    } else {
      log("red", "✗ FAIL: Non-existent ID did not return proper error");
      console.log("  Result:", result);
      failed++;
    }
  } catch (error) {
    log("red", `✗ FAIL: Non-existent ID threw unexpected error: ${error}`);
    failed++;
  }

  // Test 5: Orders include customer names
  try {
    log("yellow", "\nTest 5: Orders include customer names");
    const result = await getEmployeeWithOrders("1");
    if (
      result.success &&
      result.data &&
      result.data.orders.length > 0 &&
      result.data.orders.some((order) => order.customerName !== null)
    ) {
      log("green", "✓ PASS: Orders include customer names");
      log(
        "green",
        `  - Sample: ${result.data.orders[0].customerName || "N/A"}`
      );
      passed++;
    } else {
      log("red", "✗ FAIL: Orders do not include customer names");
      failed++;
    }
  } catch (error) {
    log("red", `✗ FAIL: Customer names test threw error: ${error}`);
    failed++;
  }

  // Test 6: Employee data structure is correct
  try {
    log("yellow", "\nTest 6: Employee data structure is correct");
    const result = await getEmployeeWithOrders("1");
    if (result.success && result.data) {
      const employee = result.data.employee;
      const hasRequiredFields =
        typeof employee.employeeId === "number" &&
        typeof employee.firstName === "string" &&
        typeof employee.lastName === "string";

      if (hasRequiredFields) {
        log("green", "✓ PASS: Employee has correct data structure");
        passed++;
      } else {
        log("red", "✗ FAIL: Employee missing required fields");
        failed++;
      }
    } else {
      log("red", "✗ FAIL: Could not retrieve employee");
      failed++;
    }
  } catch (error) {
    log("red", `✗ FAIL: Data structure test threw error: ${error}`);
    failed++;
  }

  // Test 7: Order data structure is correct
  try {
    log("yellow", "\nTest 7: Order data structure is correct");
    const result = await getEmployeeWithOrders("1");
    if (result.success && result.data && result.data.orders.length > 0) {
      const order = result.data.orders[0];
      const hasRequiredFields =
        typeof order.orderId === "number" &&
        (order.orderDate === null || typeof order.orderDate === "string") &&
        (order.customerName === null ||
          typeof order.customerName === "string");

      if (hasRequiredFields) {
        log("green", "✓ PASS: Orders have correct data structure");
        passed++;
      } else {
        log("red", "✗ FAIL: Orders missing required fields");
        console.log("  Order sample:", order);
        failed++;
      }
    } else {
      log("red", "✗ FAIL: Could not retrieve orders");
      failed++;
    }
  } catch (error) {
    log("red", `✗ FAIL: Order structure test threw error: ${error}`);
    failed++;
  }

  // Test 8: Stats are calculated correctly
  try {
    log("yellow", "\nTest 8: Stats are calculated correctly");
    const result = await getEmployeeWithOrders("1");
    if (result.success && result.data && result.data.stats) {
      const { stats, orders } = result.data;
      const statsValid =
        stats.totalOrders === orders.length &&
        stats.uniqueCustomers > 0 &&
        stats.shippedOrders >= 0 &&
        stats.shippedOrders <= stats.totalOrders;

      if (statsValid) {
        log("green", "✓ PASS: Stats calculated correctly");
        log("green", `  - Total: ${stats.totalOrders}, Unique customers: ${stats.uniqueCustomers}, Shipped: ${stats.shippedOrders}`);
        passed++;
      } else {
        log("red", "✗ FAIL: Stats calculation is incorrect");
        console.log("  Stats:", stats);
        failed++;
      }
    } else {
      log("red", "✗ FAIL: Stats not returned");
      failed++;
    }
  } catch (error) {
    log("red", `✗ FAIL: Stats test threw error: ${error}`);
    failed++;
  }

  // Test 9: Integer bounds validation
  try {
    log("yellow", "\nTest 9: Integer bounds validation (negative number)");
    const result = await getEmployeeWithOrders("-1");
    if (!result.success && result.error === "Invalid employee ID") {
      log("green", "✓ PASS: Negative ID rejected");
      passed++;
    } else {
      log("red", "✗ FAIL: Negative ID not properly validated");
      failed++;
    }
  } catch (error) {
    log("red", `✗ FAIL: Bounds test threw error: ${error}`);
    failed++;
  }

  // Test 10: Integer overflow protection
  try {
    log("yellow", "\nTest 10: Integer overflow protection (beyond max int)");
    const result = await getEmployeeWithOrders("9999999999999");
    if (!result.success && result.error === "Invalid employee ID") {
      log("green", "✓ PASS: Overflow ID rejected");
      passed++;
    } else {
      log("red", "✗ FAIL: Overflow ID not properly validated");
      failed++;
    }
  } catch (error) {
    log("red", `✗ FAIL: Overflow test threw error: ${error}`);
    failed++;
  }

  // Summary
  log("blue", "\n" + "=".repeat(50));
  log("blue", `Test Results: ${passed} passed, ${failed} failed`);
  log("blue", "=".repeat(50) + "\n");

  if (failed === 0) {
    log("green", "🎉 All tests passed!");
    process.exit(0);
  } else {
    log("red", "❌ Some tests failed");
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  log("red", `Fatal error running tests: ${error}`);
  process.exit(1);
});
